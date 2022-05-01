<template>
    <div class="home" style="height: 100%; display: flex">
        <div class="left" style="height: 100%; max-width: 300px; width: 30%; flex: 1">
            <RoomList @select="onSelect" @roomList="onRoomList" />
        </div>
        <div class="right" style="height: 100%; flex: 1">
            <Room
                ref="room"
                :room="room"
                @filesChange="onFilesChange($event, room)"
                :othersInfo="othersInfo"
            />
        </div>
        <div class="bottom" style="position: absolute; bottom: 0; left: 0; right: 0; height: 20px">
            <div style="position: absolute; right: 5px">{{ id.slice(0, 15) }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import RoomList from "../components/RoomList.vue";
import Room from "../components/Room.vue";
import config from "../config";
import JSEncrypt from "jsencrypt";
import { request } from "../common/io";
import { decrypt, encrypt, encryptBlobToBlob, hash } from "../common/crypto";
import { mapActions, mapMutations } from "vuex";
import { AnyMap } from "../common/types";

export default {
    name: "HomeView",
    data() {
        // const id = Math.floor(Math.random() * 1e5);
        return {
            processingChunk: false,
            intervalList: [],
            id: "HomeView",
            room: null,
            othersInfo: [],

            AESKey: "" // between client and server
        };
    },
    created() {
        this.roomsInfo = {};
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(config.pubicKey);
        this.encrypt = encrypt;
        this.AESKey = this.generateAESKey();
        this.$store.commit("setAESKey", this.AESKey);
        this.id = hash(this.AESKey, config.aesSalt);
        this.$store.commit("setID", this.id);
        this.encryptedBasic = this.encrypt.encrypt(
            JSON.stringify({
                AESKey: this.AESKey
            })
        );
        window.onbeforeunload = () => {
            this.exit();
        };
    },
    destroyed() {
        console.log(1);
        this.exit();
        this.intervalList.forEach(interval => {
            clearInterval(interval);
        });
        this.intervalList = [];
    },
    mounted() {
        this.ping();
        const interval = setInterval(() => {
            this.ping();
        }, 9000);
        setTimeout(() => {
            this.getRoomInfo();
        }, 500);
        const interval2 = setInterval(() => {
            this.getRoomInfo();
        }, 3000);
        this.intervalList.push(interval);
        this.intervalList.push(interval2);
    },
    methods: {
        ...mapMutations(["getAESKey"]),
        ...mapActions(["safeRequest"]),
        exit() {
            request({
                method: "exit",
                data: {
                    id: this.id,
                    d: encrypt(JSON.stringify({}), this.AESKey)
                }
            });
        },
        generateAESKey() {
            return String(Math.random()) + String(Date.now());
        },
        async onWaitChunkMap(waitChunkMap) {
            if (this.processingChunk) {
                return;
            }
            this.processingChunk = true;
            try {
                let fileInfo;
                let path = { roomHash: "", fileHash: "" };
                for (const url in waitChunkMap) {
                    const [roomHash, fileHash] = url.split("-");
                    if (!this.roomsInfo[roomHash]) {
                        continue;
                    }

                    fileInfo = this.roomsInfo[roomHash].files.find(fileInfo => {
                        return fileInfo.hash === fileHash;
                    });
                    if (fileInfo) {
                        path = {
                            roomHash,
                            fileHash
                        };
                        break;
                    }
                }
                const url = path.roomHash + "-" + path.fileHash;
                if (fileInfo) {
                    const requestInfo = waitChunkMap[url];
                    const ret = await this.pushChunk({
                        position: requestInfo[0].position,
                        size: requestInfo[0].size,
                        file: fileInfo.file,
                        roomHash: path.roomHash,
                        fileHash: path.fileHash
                    });
                    if (ret.waitChunkMap) {
                        setTimeout(() => {
                            this.onWaitChunkMap(ret.waitChunkMap);
                        });
                    }
                }
            } finally {
                this.processingChunk = false;
            }
        },
        async pushChunk({ position, size, file, roomHash, fileHash }) {
            const roomPassword = this.roomsInfo[roomHash].roomPassword;
            const form: any = new FormData();
            const blob = file.slice(position, position + size);
            const encryptedBlob = await encryptBlobToBlob(blob, roomPassword);
            console.log("encryptedBlob", encryptedBlob);
            form.append("blob", encryptedBlob);
            form.append("id", this.id);
            form.append(
                "d",
                encrypt(
                    JSON.stringify({
                        position,
                        size,
                        roomHash,
                        fileHash
                    }),
                    this.AESKey
                )
            );
            const result = await request({
                method: "push",
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                data: form
            });

            const ret = this.decryptRet(result);
            return ret;
            // console.log("ret", ret);
        },
        decryptRet(result: string): AnyMap {
            if (result === "OK") {
                return {};
            }
            return JSON.parse(decrypt(result, this.$store.getters.AESKey));
        },
        async getRoomInfo() {
            let result = await this.safeRequest({
                method: "getRoomInfo",
                data: { roomHash: this.room.hash }
            });
            result = JSON.parse(result);
            if (result.waitChunkMap) {
                this.onWaitChunkMap(result.waitChunkMap);
            }
            this.othersInfo = result.others;
        },
        ping() {
            const encryptedRoomsInfo = {};
            for (const roomHash in this.roomsInfo) {
                encryptedRoomsInfo[roomHash] = {};
                encryptedRoomsInfo[roomHash].files = this.roomsInfo[roomHash].encryptedFiles;
            }
            request({
                method: "ping",
                data: {
                    e: this.encryptedBasic,
                    i: encrypt(JSON.stringify(encryptedRoomsInfo), this.AESKey)
                }
            });
        },
        onRoomList(roomList) {
            roomList?.forEach(room => {
                const roomHash = hash(room.roomPassword, config.roomSalt);
                if (!this.roomsInfo[roomHash]) {
                    this.roomsInfo[roomHash] = {};
                }
            });
            this.ping();
        },
        onFilesChange(files, room) {
            const filesInfo = files?.map(file => {
                return {
                    size: file.size,
                    name: file.name
                };
            });
            this.roomsInfo[room.hash].files = files;
            this.roomsInfo[room.hash].roomPassword = room.roomPassword;
            this.roomsInfo[room.hash].encryptedFiles = encrypt(
                JSON.stringify(filesInfo),
                room.roomPassword
            );
            this.ping();
        },
        onSelect(room) {
            this.room = room;
            this.$refs.room.setFiles(this.roomsInfo[room.hash].files);
            this.othersInfo = [];
            this.getRoomInfo();
        }
    },
    components: {
        RoomList,
        Room
    }
};
</script>
<style>
.home {
    /* max-width: 800px; */
}
</style>
