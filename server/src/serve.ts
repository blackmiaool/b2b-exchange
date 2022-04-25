import app from "./app";
import Router from "koa-router";
import config from "./config";
import nodeRSA from "node-rsa";
import { decrypt, encrypt, hash } from "./common/crypto";
import LiveMap from "./common/liveMap";
import fs from "fs";

const router = new Router();

const rsakey = new nodeRSA(config.privateKey);
rsakey.setOptions({ encryptionScheme: "pkcs1" }); // Must Set It When Frontend Use jsencrypt

router.options("/(.*)", async (ctx) => {
    const origin = ctx.request.header.origin;

    ctx.set({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "600",
        "Access-Control-Allow-Methods": "*",
    });
    ctx.status = 200;
    // ctx.router available
});

router.use(async (ctx, next) => {
    const origin = ctx.request.header.origin;

    ctx.set({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "600",
        "Access-Control-Allow-Methods": "*",
    });
    return next();
    // ctx.router available
});
const liveMap = new LiveMap<{
    AESKey: string;
    roomsInfo: {
        files: { size: number; name: string };
    };
}>({
    timeout: 62e3,
});
const waitChunkMap = {}; //[id][roomHash][fileName]
router.post("/(.*)", async (ctx) => {
    const method = ctx.request.url.replace(/^\//, "");
    const data = ctx.request.body;
    const allInfo = liveMap.getAll();
    let AESKey;
    let request;
    const requestId = data.id;

    if (requestId) {
        if (!data.d) {
            console.log("id without d", requestId, data.d);
            ctx.status = 400;
            return;
        }
        const info = allInfo.get(requestId);
        if (!info) {
            ctx.status = 401;
            return;
        }
        AESKey = info.data.AESKey;
        if (requestId) {
            try {
                request = JSON.parse(decrypt(data.d, AESKey));
            } catch (e) {
                console.log("can't decrypt d", e.message);
                ctx.status = 401;
                return;
            }
        }
    }

    function generateSafeBody(body: Record<string, any> | any[]) {
        return encrypt(JSON.stringify(body), AESKey);
    }
    // function getWaitChunkMap() {
    //     const ret = {};
    //     if (waitChunkMap[requestId]) {
    //         for (const room in waitChunkMap[requestId]) {
    //             waitChunkMapRet[room] = {};
    //             for (const file in waitChunkMap[requestId]) {
    //                 waitChunkMapRet[room][file] = true;
    //             }
    //         }
    //         ret.waitChunkMap = waitChunkMap[requestId];
    //     }
    //     return ret;
    // }
    switch (method) {
        case "push": {
            if (!requestId) {
                ctx.status = 400;
                return;
            }
            const roomChunkRequest =
                waitChunkMap?.[requestId]?.[request.roomHash];
            if (!roomChunkRequest?.[request.fileHash]) {
                ctx.status = 200;
                return;
            }
            roomChunkRequest[request.fileHash] = roomChunkRequest[
                request.fileHash
            ].filter(({ resolve, position, size }) => {
                if (position === request.position && size === request.size) {
                    resolve(fs.readFileSync(ctx.request.files.blob.path));
                    return false;
                }
                return true;
            });
            if (!roomChunkRequest[request.fileHash].length) {
                delete roomChunkRequest[request.fileHash];
            }
            if (roomChunkRequest && !Object.keys(roomChunkRequest).length) {
                delete waitChunkMap[requestId][request.roomHash];
            }
            if (
                waitChunkMap[requestId] &&
                !Object.keys(waitChunkMap[requestId]).length
            ) {
                delete waitChunkMap[requestId];
            }
            const ret = {
                waitChunkMap: null,
            };
            // console.log("ctx.request.body", ctx.request.files);
            if (waitChunkMap[requestId]) {
                ret.waitChunkMap = waitChunkMap[requestId];
            }
            ctx.body = generateSafeBody(ret);
            ctx.status = 200;
            break;
        }
        case "chunk": {
            if (!requestId) {
                ctx.status = 400;
                return;
            }
            // console.log("chunk", request);
            const chunk = await new Promise((resolve) => {
                if (!waitChunkMap[request.id]) {
                    waitChunkMap[request.id] = {};
                }
                if (!waitChunkMap[request.id][request.roomHash]) {
                    waitChunkMap[request.id][request.roomHash] = {};
                }
                if (
                    !waitChunkMap[request.id][request.roomHash][
                        request.fileName
                    ]
                ) {
                    waitChunkMap[request.id][request.roomHash][
                        request.fileName
                    ] = [];
                }
                const requestList =
                    waitChunkMap[request.id][request.roomHash][
                        request.fileName
                    ];
                const got = requestList.some((waiting) => {
                    if (
                        waiting.requestId === requestId &&
                        waiting.position === request.position
                    ) {
                        // console.log(waiting.requestId, requestId);
                        waiting.resolve = resolve;
                        return true;
                    }
                    return false;
                });
                if (!got) {
                    waitChunkMap[request.id][request.roomHash][
                        request.fileName
                    ].push({
                        resolve,
                        requestId,
                        position: request.position,
                        size: request.size,
                    });
                }
            });
            ctx.body = chunk;
            ctx.status = 200;
            break;
        }
        case "exit": {
            if (!requestId) {
                ctx.status = 400;
                return;
            }
            liveMap.delete(requestId);
            ctx.status = 200;
            break;
        }
        case "download": {
            if (!requestId) {
                ctx.status = 400;
                return;
            }
            console.log(request);
            ctx.body = generateSafeBody({
                code: 0,
            });
            ctx.status = 200;
            break;
        }
        case "getRoomInfo": {
            if (!requestId) {
                ctx.status = 400;
                return;
            }
            const ret: any = {};
            const others = [];
            for (const [id, { data }] of allInfo) {
                if (id === requestId) {
                    continue;
                }
                for (const roomHash in data.roomsInfo) {
                    if (
                        roomHash === request.roomHash &&
                        Object.keys(data.roomsInfo[roomHash]).length
                    ) {
                        others.push({
                            roomHash,
                            room: data.roomsInfo[roomHash],
                            id,
                        });
                    }
                }
            }
            ret.others = others;
            if (waitChunkMap[requestId]) {
                ret.waitChunkMap = waitChunkMap[requestId];
            }
            ctx.body = generateSafeBody(ret);
            ctx.status = 200;
            break;
        }
        case "ping": {
            let basicInfo;
            let id;
            try {
                basicInfo = JSON.parse(rsakey.decrypt(data.e, "utf8"));
                id = hash(basicInfo.AESKey, config.aesSalt);
            } catch (e) {
                ctx.body = "can't decode";
                ctx.status = 401;
                console.log("can't decode", e.message);
                return;
            }
            const roomsInfo = JSON.parse(decrypt(data.i, basicInfo.AESKey));
            liveMap.update(id, {
                AESKey: basicInfo.AESKey,
                roomsInfo,
            });
            ctx.body = "ok";
            ctx.status = 200;
            break;
        }
    }
});
app.use(router.routes()).use(router.allowedMethods());
