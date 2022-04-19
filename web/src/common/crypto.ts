import crypto from "crypto-js";

const hashCache = {};
export function hash(message) {
    if (!hashCache[message]) {
        const result = crypto.SHA512(message).toString();
        hashCache[message] = result;
    }
    return hashCache[message];
}
