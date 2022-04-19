import app from "./app";
import Router from "koa-router";
import config from "./config";
import nodeRSA from "node-rsa";
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
router.post("/(.*)", async (ctx) => {
    console.log(ctx.request);
    console.log(ctx.request.body);
    const d = rsakey.decrypt(ctx.request.body.data.e, "utf8");
    console.log(d);
    // encrypt.decrypt
    ctx.body = "ok";
    ctx.status = 200;
});
app.use(router.routes()).use(router.allowedMethods());
