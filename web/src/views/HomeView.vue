<template>
    <div class="home" style="height: 100%; display: flex">
        <div class="left" style="height: 100%; max-width: 300px; width: 30%; flex: 1">
            <RoomList @select="onSelect" @roomList="onRoomList" />
        </div>
        <div class="right" style="height: 100%; flex: 1">
            <Room :room="room" @filesChange="onFilesChange($event, room)" />
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

export default {
    name: "HomeView",
    data() {
        // const id = Math.floor(Math.random() * 1e5);
        return {
            intervalList: [],
            id: "HomeView",
            room: null
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
        this.intervalList.push(interval);
    },
    destroyed() {
        this.intervalList.forEach(interval => {
            clearInterval(interval);
        });
        this.intervalList = [];
    },
    methods: {
        ping() {
            console.log(this.roomsInfo);
            request({
                method: "ping",
                data: {
                    e: this.encryptedBasic,
                    i: encrypt(JSON.stringify(this.roomsInfo), this.AESKey)
                }
            });
        },
        onRoomList(roomList) {
            roomList?.forEach(room => {
                this.roomsInfo[room.roomName] = {
                    hash: hash(room.password, config.roomSalt)
                };
            });
            console.log(2, roomList);
        },
        onFilesChange(files, room) {
            const filesInfo = files?.map(file => {
                return {
                    size: file.size,
                    name: file.name
                };
            });
            this.roomsInfo[room.roomName].files = filesInfo;

            console.log("onFilesChange", files, room);
        },
        onSelect(room) {
            this.room = room;
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
