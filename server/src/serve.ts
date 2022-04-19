import app from "./app";
import Router from "koa-router";
import config from "./config";
import nodeRSA from "node-rsa";
import { decrypt, hash } from "./common/crypto";
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
const liveMap = new LiveMap({
    timeout: 3e4,
});

router.post("/(.*)", async (ctx) => {
    const method = ctx.request.url.replace(/^\//, "");
    const data = ctx.request.body.data;
    // console.log(ctx.request.body);
    switch (method) {
        case "ping": {
            let basicInfo;
            let id;
            try {
                basicInfo = JSON.parse(rsakey.decrypt(data.e, "utf8"));
                id = hash(basicInfo.AESKey, config.aesSalt).slice(0, 15);
            } catch (e) {
                ctx.body = "can't decode";
                ctx.status = 401;
                return;
            }
            const roomsInfo = JSON.parse(decrypt(data.i, basicInfo.AESKey));
            // console.log(result);
            console.log("basicInfo", basicInfo, id);
            console.log(roomsInfo);
            liveMap.update(id, {
                AESKey: basicInfo,
            });

            // encrypt.decrypt
            ctx.body = "ok";
            ctx.status = 200;
            break;
        }
    }
});
app.use(router.routes()).use(router.allowedMethods());
