import crypto from "crypto";
import CryptoJS from "crypto-js";
export function decrypt(message, secret) {
    return CryptoJS.AES.decrypt(message, secret).toString(CryptoJS.enc.Utf8);
}

export function hash(message, salt: string) {
    return (
        crypto
            .createHash("sha512")

            // updating data
            .update(message + "-" + salt)

            // Encoding to be used
            .digest("hex")
    );
}
