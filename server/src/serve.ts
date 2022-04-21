import app from "./app";
import Router from "koa-router";
import config from "./config";
import nodeRSA from "node-rsa";
import { decrypt, encrypt, hash } from "./common/crypto";
import LiveMap from "./common/liveMap";
const router = new Router();

const rsakey = new nodeRSA(config.privateKey);
rsakey.setOptions({ encryptionScheme: "pkcs1" }); // Must Set It When Frontend Use jsencrypt

router.options("/(.*)", async (ctx) => {
    const origin = ctx.request.header.origin;
    if (origin && origin.startsWith("http://localhost:")) {
        ctx.set({
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "600",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Credentials": "true",
        });
    } else {
        ctx.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "600",
            "Access-Control-Allow-Methods": "*",
        });
    }
    ctx.status = 200;
    // ctx.router available
});

router.use(async (ctx, next) => {
    const origin = ctx.request.header.origin;
    if (origin && origin.startsWith("http://localhost:")) {
        ctx.set({
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "600",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Credentials": "true",
        });
    } else {
        ctx.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "600",
            "Access-Control-Allow-Methods": "*",
        });
    }
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

router.post("/(.*)", async (ctx) => {
    const method = ctx.request.url.replace(/^\//, "");
    const data = ctx.request.body.data;
    const allInfo = liveMap.getAll();
    let AESKey;
    let request;
    let requestId;

    if (data.id) {
        if (!data.d) {
            console.log("id without d", data.id, data.d);
            return;
        }
        const info = allInfo.get(data.id);
        if (!info) {
            console.log("can't find id", data.id);
            return;
        }
        AESKey = info.data.AESKey;
        try {
            request = JSON.parse(decrypt(data.d, AESKey));
        } catch (e) {
            console.log("can't decrypt d", e.message);
            return;
        }

        requestId = data.id;
    }
    function getSafeBody(body: Record<string, any> | any[]) {
        return encrypt(JSON.stringify(body), AESKey);
    }
    switch (method) {
        case "exit": {
            liveMap.delete(requestId);
            console.log("exit", requestId);
            break;
        }
        case "download": {
            console.log(request);
            ctx.body = getSafeBody({
                code: 0,
            });
            ctx.status = 200;
            break;
        }
        case "getRoomInfo": {
            const ret = [];
            for (const [id, { data }] of allInfo) {
                if (id === requestId) {
                    continue;
                }
                for (const hash in data.roomsInfo) {
                    if (hash === request.roomHash) {
                        ret.push({
                            hash,
                            room: data.roomsInfo[hash],
                            id,
                        });
                    }
                }
            }
            ctx.body = getSafeBody(ret);
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
