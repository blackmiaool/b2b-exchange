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
import { encrypt, hash } from "../common/crypto";
import { mapActions } from "vuex";
export default {
    name: "HomeView",
    data() {
        // const id = Math.floor(Math.random() * 1e5);
        return {
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
            this.safeRequest({
                method: "exit",
                data: {}
            });
        };
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
    destroyed() {
        this.intervalList.forEach(interval => {
            clearInterval(interval);
        });
        this.intervalList = [];
    },
    methods: {
        ...mapActions(["safeRequest"]),
        generateAESKey() {
            return String(Math.random()) + String(Date.now());
        },
        async getRoomInfo() {
            let result = await this.safeRequest({
                method: "getRoomInfo",
                data: { roomHash: hash(this.room.roomPassword, config.roomSalt) }
            });
            result = JSON.parse(result);
            if (result.waitChunkMap) {
                for (const roomHash in result.waitChunkMap) {
                    if (!this.roomsInfo[roomHash]) {
                        continue;
                    }
                    for (const fileHash in result.waitChunkMap[roomHash]) {
                        this.roomsInfo[roomHash].files.some(fileInfo => {
                            if (hash(fileInfo.name, config.fileSalt) === fileHash) {
                                // console.log(
                                //     "found",
                                //     result.waitChunkMap[roomHash][fileHash][0],
                                //     fileInfo
                                // );
                                const requestInfo = result.waitChunkMap[roomHash][fileHash];
                                const form: any = new FormData();
                                form.append("my_field", "my value");
                                form.append(
                                    "my_buffer",
                                    fileInfo.file.slice(
                                        requestInfo[0].position,
                                        requestInfo[0].position + requestInfo[0].size
                                    )
                                );

                                request({
                                    method: "push",
                                    headers: {
                                        "Content-Type": "multipart/form-data",
                                        ri: JSON.stringify({
                                            id: this.id,
                                            d: encrypt(
                                                JSON.stringify({
                                                    position: requestInfo[0].position,
                                                    size: requestInfo[0].size,
                                                    roomHash,
                                                    fileHash
                                                }),
                                                this.AESKey
                                            )
                                        })
                                    },
                                    data: form
                                });
                                return true;
                            }
                            return false;
                        });
                    }
                }
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
            const roomHash = hash(room.roomPassword, config.roomSalt);
            this.roomsInfo[roomHash].files = files;
            // this.roomsInfo[roomHash].filesInfo = filesInfo; // filesInfo), room.roomPassword);
            this.roomsInfo[roomHash].encryptedFiles = encrypt(
                JSON.stringify(filesInfo),
                room.roomPassword
            );
            this.ping();
        },
        onSelect(room) {
            this.room = room;
            const roomHash = hash(room.roomPassword, config.roomSalt);
            this.$refs.room.setFiles(this.roomsInfo[roomHash].files);

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
