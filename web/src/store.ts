import Vue from "vue";
import Vuex from "vuex";
import { decrypt, decryptBlobToBlob, encrypt, hash } from "./common/crypto";
import { request } from "./common/io";
import parallelTask from "./common/parallelTask";
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
        async download({ dispatch, state }, { roomHash, roomPassword, fileName, fileSize, from }) {
            const result = await request({
                method: "download",
                data: {
                    id: state.id,
                    d: encrypt(
                        JSON.stringify({
                            roomHash,
                            id: from,
                            fileName: encrypt(fileName, roomPassword)
                        }),
                        state.AESKey
                    )
                }
            });
            const info = JSON.parse(decrypt(result, state.AESKey));
            if (info.code !== 0) {
                throw new Error(info.message);
            }
            const chunkSize = 1e6;
            const lastChunk = fileSize % chunkSize;
            const chunkCount = Math.floor(fileSize / chunkSize) + (lastChunk ? 1 : 0);
            console.log(fileSize, chunkCount, lastChunk);
            const buffers = [];
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
                                    fileName: hash(fileName, config.fileSalt)
                                }),
                                state.AESKey
                            )
                        }
                    });
                    buffers[index] = await decryptBlobToBlob(result, roomPassword);
                    // buffers[index] = decrypt(await result.arrayBuffer(), roomPassword, true);
                },
                index => {
                    return index >= chunkCount;
                },
                5
            );
            console.log(buffers);
            const blob = new Blob(buffers);
            downloadBlob(blob, fileName);
            function downloadBlob(blob, name = "file.txt") {
                // For other browsers:
                // Create a link pointing to the ObjectURL containing the blob.
                const data = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = data;
                link.download = name;

                // this is necessary as link.click() does not work on the latest firefox
                link.dispatchEvent(
                    new MouseEvent("click", {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    })
                );

                setTimeout(() => {
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    window.URL.revokeObjectURL(data);
                    link.remove();
                }, 100);
            }
            // start download process
        }
    }
});
export default store;
