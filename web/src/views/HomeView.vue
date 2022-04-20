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
import { decrypt, encrypt, hash } from "../common/crypto";

export default {
    name: "HomeView",
    data() {
        // const id = Math.floor(Math.random() * 1e5);
        return {
            intervalList: [],
            id: "HomeView",
            room: null,
            othersInfo: []
            // AESKey: null
        };
    },
    created() {
        this.roomsInfo = {};
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(config.pubicKey);
        this.encrypt = encrypt;
        this.AESKey = String(Math.random()) + String(Date.now());
        this.id = hash(this.AESKey, config.aesSalt);
        this.encryptedBasic = this.encrypt.encrypt(
            JSON.stringify({
                AESKey: this.AESKey
            })
        );
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
        async safeRequest({ method, data }) {
            const result = await request({
                method,
                data: {
                    id: this.id,
                    d: encrypt(JSON.stringify(data), this.AESKey)
                }
            });
            return decrypt(result, this.AESKey);
        },
        async getRoomInfo() {
            const result = await this.safeRequest({
                method: "getRoomInfo",
                data: { roomHash: hash(this.room.roomPassword, config.roomSalt) }
            });
            this.othersInfo = JSON.parse(result);
            console.log("this.othersInfo ", this.othersInfo);
        },
        ping() {
            request({
                method: "ping",
                data: {
                    e: this.encryptedBasic,
                    i: encrypt(JSON.stringify(this.roomsInfo), this.AESKey)
                }
            });
        },
        onRoomList(roomList) {
            console.log("on room list", roomList);
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
            console.log(room.roomPassword);
            const roomHash = hash(room.roomPassword, config.roomSalt);
            this.roomsInfo[roomHash].files = filesInfo;

            console.log("onFilesChange", files, room);
            this.ping();
            console.log("this.roomsInfo", this.roomsInfo);
        },
        onSelect(room) {
            console.log("on select", room);
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
