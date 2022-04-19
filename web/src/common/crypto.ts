import crypto from "crypto-js";

const hashCache = {};
export function encrypt(message, secret) {
    return crypto.AES.encrypt(message, secret).toString();
}
export function hash(message, salt) {
    if (!hashCache[message]) {
        const result = crypto.SHA512(message + "-" + salt).toString();
        hashCache[message] = result;
    }
    return hashCache[message];
}
