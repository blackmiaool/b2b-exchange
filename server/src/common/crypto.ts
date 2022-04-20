import crypto from "crypto";
import CryptoJS from "crypto-js";
export function decrypt(message, secret) {
    return CryptoJS.AES.decrypt(message, secret).toString(CryptoJS.enc.Utf8);
}
export function encrypt(message, secret) {
    return CryptoJS.AES.encrypt(message, secret).toString();
}
const hashCache = {};
export function hash(message, salt) {
    if (!hashCache[message]) {
        const result = CryptoJS.SHA512(message + "-" + salt).toString();
        hashCache[message] = result;
    }
    return hashCache[message];
}
// export function hash(message, salt: string) {
//     return (
//         crypto
//             .createHash("sha512")

//             // updating data
//             .update(message + "-" + salt)

//             // Encoding to be used
//             .digest("hex")
//     );
// }
