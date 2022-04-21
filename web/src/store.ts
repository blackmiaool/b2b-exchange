import Vue from "vue";
import Vuex from "vuex";
import { decrypt, encrypt } from "./common/crypto";
import { request } from "./common/io";

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
            console.log(info);
            if (info.code !== 0) {
                throw new Error(info.message);
            }
            // start download process
        }
    }
});
export default store;
