import CryptoJS from "crypto-js";

const hashCache = {};
export function encrypt(message, secret) {
    const result = CryptoJS.AES.encrypt(message, secret);
    return result.toString();
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

export async function encryptBlobToBlob(blob: Blob, secret: string): Promise<Blob> {
    const wordArray = CryptoJS.lib.WordArray.create(await blob.arrayBuffer());
    const result = CryptoJS.AES.encrypt(wordArray, secret);
    return new Blob([result.toString()]);
}
export async function decryptBlobToBlob(blob: Blob, secret: string): Promise<Blob> {
    const decryptedRaw = CryptoJS.AES.decrypt(await blob.text(), secret);
    return new Blob([wordArrayToByteArray(decryptedRaw)]);
}

function wordToByteArray(word, length) {
    const ba = [];
    const xFF = 0xff;
    if (length > 0) ba.push(word >>> 24);
    if (length > 1) ba.push((word >>> 16) & xFF);
    if (length > 2) ba.push((word >>> 8) & xFF);
    if (length > 3) ba.push(word & xFF);

    return ba;
}

function wordArrayToByteArray({ words, sigBytes }: { sigBytes: number; words: number[] }) {
    const result = [];
    let bytes;
    let i = 0;
    while (sigBytes > 0) {
        bytes = wordToByteArray(words[i], Math.min(4, sigBytes));
        sigBytes -= bytes.length;
        result.push(bytes);
        i++;
    }
    return new Uint8Array(result.flat());
}
