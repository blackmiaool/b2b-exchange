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
    timeout: 3e4,
});

router.post("/(.*)", async (ctx) => {
    const method = ctx.request.url.replace(/^\//, "");
    const data = ctx.request.body.data;
    // console.log(ctx.request.body);
    const allInfo = liveMap.getAll();
    let AESKey;
    let request;
    let requestId;

    if (data.id && data.d) {
        const info = allInfo.get(data.id);
        if (!info) {
            return;
        }
        AESKey = info.data.AESKey;
        console.log(data, AESKey);
        request = JSON.parse(decrypt(data.d, AESKey));
        requestId = data.id;
    }
    // console.log(allInfo.get("35cd9416345f3af")?.data);
    switch (method) {
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
            ctx.body = encrypt(JSON.stringify(ret), AESKey);
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
                return;
            }
            const roomsInfo = JSON.parse(decrypt(data.i, basicInfo.AESKey));
            // console.log(result);
            // console.log("basicInfo", basicInfo, id);
            // console.log(roomsInfo);
            liveMap.update(id, {
                AESKey: basicInfo.AESKey,
                roomsInfo,
            });
            // console.log(liveMap);
            // encrypt.decrypt
            ctx.body = "ok";
            ctx.status = 200;
            break;
        }
    }
});
app.use(router.routes()).use(router.allowedMethods());
