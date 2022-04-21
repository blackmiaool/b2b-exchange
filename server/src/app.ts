import convert from "koa-convert";
import json from "koa-json";
import config from "./config";
import koaBody from "koa-body";
import Koa from "koa";

const app = new Koa();
declare global {
    interface Date {
        UTCformat(format: string): string;
        format(format: string): string;
    }
}
// const cors = require('kcors');
Date.prototype.format = function (format) {
    const zeros = ["", "0", "00", "000", "0000"];
    const c = {
        "Y+": this.getFullYear(),
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds(),
    };
    if (/(y+)/.test(format)) {
        format = format.replace(
            RegExp.$1,
            `${this.getFullYear()}`.substr(4 - RegExp.$1.length)
        );
    }
    for (const k in c) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? c[k]
                    : (zeros[RegExp.$1.length] + c[k]).substr(`${c[k]}`.length)
            );
        }
    }
    return format;
};
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
