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

//[id][roomHash+'-'+fileHash]
class WaitChunkMap {
    all = {};
    requestCache = {};
    constructor() {}
    deleteRequestsFrom(id) {
        const cache = this.requestCache[id];
        if (cache) {
            for (const path in cache) {
                const [from, url] = path.split("#");
                const requestList = this.all[from]?.[url];
                if (requestList) {
                    this.all[from][url] = requestList.filter((waiting) => {
                        if (waiting.requestId === id) {
                            return false;
                        }
                        return true;
                    });
                }
            }
            delete this.requestCache[id];
        }
    }
    getFrom(requestId: string) {
        return this.all[requestId];
    }
    request({
        resolve,
        from,
        url,
        requestId,
        position,
        size,
    }: {
        resolve: (buffer: Buffer) => any;
        from: string;
        url: string;
        requestId: string;
        position: number;
        size: number;
    }) {
        const waitChunkMap = this.all;
        if (!waitChunkMap[from]) {
            waitChunkMap[from] = {};
        }
        if (!this.requestCache[requestId]) {
            this.requestCache[requestId] = {};
        }
        this.requestCache[requestId][from + "#" + url] = true;
        // if (!waitChunkMap[request.id][request.roomHash]) {
        //     waitChunkMap[request.id][request.roomHash] = {};
        // }
        if (!waitChunkMap[from][url]) {
            waitChunkMap[from][url] = [];
        }
        const requestList = waitChunkMap[from][url];
        const requestExist = requestList.some((waiting) => {
            if (
                waiting.requestId === requestId &&
                waiting.position === position &&
                waiting.size === size
            ) {
                // console.log(waiting.requestId, requestId);
                waiting.resolve = resolve;
                return true;
            }
            return false;
        });
        if (!requestExist) {
            waitChunkMap[from][url].push({
                resolve,
                requestId,
                position,
                size,
            });
        }
    }
    push({
        from,
        url,
        content,
        position,
        size,
    }: {
        from: string;
        url: string;
        content: Buffer;
        position: number;
        size: number;
    }) {
        const waitChunkMap = this.all;
        if (!waitChunkMap[from][url]) {
            return null;
        }
        waitChunkMap[from][url] = waitChunkMap[from][url].filter((wait) => {
            if (wait.position === position && wait.size === size) {
                wait.resolve(content);
                return false;
            }
            return true;
        });
        if (!waitChunkMap[from][url].length) {
            delete waitChunkMap[from][url];
        }
        if (waitChunkMap[from] && !Object.keys(waitChunkMap[from]).length) {
            delete waitChunkMap[from];
        }
        return waitChunkMap[from];
    }
}
const waitChunkMap = new WaitChunkMap();

liveMap.on("delete", (id) => {
    waitChunkMap.deleteRequestsFrom(id);
});

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
        const info = liveMap.get(requestId);
        if (!info) {
            ctx.status = 401;
            return;
        }
        AESKey = info.AESKey;
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
            const from = requestId;
            const url = request.roomHash + "-" + request.fileHash;

            const result = waitChunkMap.push({
                from,
                url,
                content: fs.readFileSync(ctx.request.files.blob.path),
                position: request.position,
                size: request.size,
            });
            fs.unlink(ctx.request.files.blob.path, () => {});
            if (!result) {
                ctx.status = 200;
                return;
            }

            const ret = {
                waitChunkMap: result,
            };

            ctx.body = generateSafeBody(ret);
            ctx.status = 200;
            break;
        }
        case "chunk": {
            if (!requestId) {
                ctx.status = 400;
                return;
            }
            const chunk = await new Promise<Buffer>((resolve) => {
                const from = request.id;
                const url = request.roomHash + "-" + request.fileHash;
                waitChunkMap.request({
                    resolve,
                    requestId,
                    from,
                    url,
                    position: request.position,
                    size: request.size,
                });
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
            ret.waitChunkMap = waitChunkMap.getFrom(requestId);

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
