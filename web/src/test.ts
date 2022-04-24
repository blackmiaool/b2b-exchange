import CryptoJS from "crypto-js";
import { decryptBlobToBlob, encryptBlobToBlob } from "./common/crypto";

async function main() {
    const secret = "bbbb";
    const blob = new Blob(["1".repeat(1e3)]);
    const encryptedBlob = await encryptBlobToBlob(blob, secret);
    console.log("enrypted blob size", encryptedBlob.size);
    const decryptedBlob = await decryptBlobToBlob(encryptedBlob, secret);
    console.log("decryptedBlob", decryptedBlob);
    console.log(await decryptedBlob.text());
}
main();
