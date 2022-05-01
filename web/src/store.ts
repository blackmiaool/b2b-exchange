import Vue from "vue";
import Vuex from "vuex";
import { decrypt, decryptBlobToBlob, encrypt, hash } from "./common/crypto";
import { request } from "./common/io";
import parallelTask from "./common/parallelTask";
import { getBlobType, isImage } from "./common/utils";
import config from "./config";

Vue.use(Vuex);
const store = new Vuex.Store({
    state: {
        AESKey: "",
        id: ""
    },
    mutations: {
        setID(state, id) {
            state.id = id;
        },
        setAESKey(state, AESKey) {
            state.AESKey = AESKey;
        },
        getAESKey(state) {
            return state.AESKey;
        }
    },
    getters: {
        AESKey(state) {
            return state.AESKey;
        }
    },
    actions: {
        incrementAsync({ commit }) {
            setTimeout(() => {
                commit("increment");
            }, 1000);
        },
        async safeRequest({ state }, { method, data }) {
            const result = await request({
                method,
                data: {
                    id: state.id,
                    d: data ? encrypt(JSON.stringify(data), state.AESKey) : undefined
                }
            });
            return decrypt(result, state.AESKey);
        },
        async download(
            { state },
            { roomHash, roomPassword, fileName, fileSize, from, onProgress }
        ) {
            const chunkSize = 3e6;
            const lastChunk = fileSize % chunkSize;
            const chunkCount = Math.floor(fileSize / chunkSize) + (lastChunk ? 1 : 0);
            console.log(fileSize, chunkCount, lastChunk);
            const buffers = [];
            onProgress(0);
            let received = 0;
            await parallelTask(
                async index => {
                    const result = await request({
                        responseType: "blob",
                        method: "chunk",
                        data: {
                            id: state.id,
                            d: encrypt(
                                JSON.stringify({
                                    roomHash,
                                    id: from,
                                    position: index * chunkSize,
                                    size:
                                        lastChunk && index === chunkCount - 1
                                            ? lastChunk
                                            : chunkSize,
                                    fileHash: hash(fileName, config.fileSalt)
                                }),
                                state.AESKey
                            )
                        }
                    });
                    buffers[index] = await decryptBlobToBlob(result, roomPassword);
                    received++;
                    onProgress(received / chunkCount);
                    // buffers[index] = decrypt(await result.arrayBuffer(), roomPassword, true);
                },
                index => {
                    return index >= chunkCount;
                },
                5
            );
            let blob: Blob;
            if (isImage(fileName)) {
                blob = new Blob(buffers, {
                    type: "image/" + getBlobType(fileName)
                });
            } else {
                blob = new Blob(buffers);
            }

            return blob;

            // start download process
        }
    }
});
export default store;
