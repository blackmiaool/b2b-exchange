import convert from "koa-convert";
import json from "koa-json";
import config from "./config";
import koaBody from "koa-body";
import Koa from "koa";

const app = new Koa();

// const cors = require('kcors');

app.use(convert(koaBody()));
app.use(convert(json()));
if (config.local) {
    app.use((ctx, next) => {
        //local only
        if (
            ctx.ip !== "::1" &&
            ctx.ip !== "::ffff:127.0.0.1" &&
            !ctx.ip.startsWith("::ffff:192.168.")
        ) {
            console.log("wrong ip", ctx.ip);
            ctx.status = 401;
            return;
        }
        return next();
    });
}

const port = config.port;
console.log(`listen on ${port}`);

const server = app.listen(port);
server.timeout = 15e3;

export default app;
