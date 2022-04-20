import CryptoJS from "crypto-js";

const hashCache = {};
export function encrypt(message, secret) {
    return CryptoJS.AES.encrypt(message, secret).toString();
}
export function decrypt(message, secret) {
    return CryptoJS.AES.decrypt(message, secret).toString(CryptoJS.enc.Utf8);
}
export function hash(message, salt) {
    if (!hashCache[message]) {
        const result = CryptoJS.SHA512(message + "-" + salt).toString();
        hashCache[message] = result;
    }
    return hashCache[message];
}
