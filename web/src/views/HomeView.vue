<template>
    <div class="home" style="height: 100%; display: flex">
        <div class="left" style="height: 100%; max-width: 300px; width: 30%; flex: 1">
            <RoomList @select="onSelect" @roomList="onRoomList" />
        </div>
        <div class="right" style="height: 100%; flex: 1">
            <Room :room="room" @filesChange="onFilesChange($event, room)" />
        </div>
        <div class="bottom" style="position: absolute; bottom: 0; left: 0; right: 0; height: 20px">
            <div style="position: absolute; right: 5px">{{ id.slice(0, 10) }}</div>
        </div>
    </div>
</template>

<script lang="ts">
import RoomList from "../components/RoomList.vue";
import Room from "../components/Room.vue";
import config from "../config";
import JSEncrypt from "jsencrypt";
import { request } from "../common/io";
import { hash } from "../common/crypto";

export default {
    name: "HomeView",
    data() {
        // const id = Math.floor(Math.random() * 1e5);
        return {
            intervalList: [],
            id: "HomeView",
            roomsInfo: {},
            room: null
            // AESKey: null
        };
    },
    created() {
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(config.pubicKey);
        this.encrypt = encrypt;
        this.AESKey = String(Math.random()) + String(Date.now());
        this.id = hash(this.AESKey + config.aesSalt);
        this.encryptedBasic = this.encrypt.encrypt(
            JSON.stringify({
                AESKey: this.AESKey
            })
        );
    },
    mounted() {
        // const encrypted = this.encrypt.encrypt("sdlkfjwem");

        // // Decrypt with the private key...
        // const decrypt = new JSEncrypt();
        // decrypt.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
        // MIICXAIBAAKBgQDhIgjSK3dRblISqcdnLoViWdqdwhUAZu5l/0uNX1HGT8+NWwSc
        // YYxX7QqDo2kNtoQ/u159CSdEMnfR2nzYv0B9TF4q5lxbdO/41IMktDH35rBCokNZ
        // qEEOVao6dQp+4a5l8uKfRPkxd3h+jtkapex8z2o1yA2oEGyuLFr6ofyJvQIDAQAB
        // AoGAMwzxrR7YHqoCiGLhaZ9d9bBkZ3OUKZQtqQlcC4G63FpKuUYTZJamKWYCBVmv
        // v8FMeds2EOpbchZzny2JM+kiaRpXWwyKA73U2i7/p8WiEja9E/wSnrW63M9tYCG+
        // l57eHyVpJ7B0xcIiC4CcgSYmXAPwgZn330f7aVXQeR3YgC0CQQD2TRNmXciNYTJs
        // HrHAu3+o6t+mRhp+qLe01+xCJVEx1pBA/ZD0/G2fXoJcjlM/V+7Y87/6Wkiqo/6H
        // ybEXp8k3AkEA6f+Q4NbuacunCpBCa2mEpcLb8d3zRk0rtmchi9J25Aan1E7Fn8nx
        // mUw9k3/+vM5umxF4ZYID16NIR/q/cujuqwJABEykIg1RCua/cpO2lp6vQ8uVy9k9
        // bSiUzFtYjG8KU8xjCD9k4GHnp/iGXgc9/MUULkVS/JPG4POr5cLnjHopUQJAe7Pl
        // jVdSlo9Y8VauJkaUH2VSDR0+vI2TbEw9CcProkR6eNxj0UNa+6W4b7+clYe0JTop
        // IdCH43mofpTqnP7THQJBAI3HOERd8mZfQXjwz6jeKq9x9dbRgLgnHnKP/juAooC9
        // KYpxe2CAuP7RZmNzsBrK7CXdXZxzQRR5i06cbeAqb+8=
        // -----END RSA PRIVATE KEY-----
        // `);
        // const uncrypted = decrypt.decrypt(encrypted as string);
        // console.log(uncrypted);
        // const en = crypto.AES.encrypt("my message", "secret key 123").toString();
        // console.log(en);
        // console.log(crypto.AES.decrypt(en, "secret key 123").toString(crypto.enc.Utf8));
        this.pingpong();
        const interval = setInterval(() => {
            this.pingpong();
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
        pingpong() {
            request({
                method: "ping",
                data: { e: this.encryptedBasic }
            });
        },
        onRoomList(roomList) {
            roomList?.forEach(room => {
                this.$set(this.roomsInfo, room.roomName, {
                    hash: hash(room.password + config.roomSalt)
                });
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
            this.$set(this.roomsInfo[room.roomName], "files", filesInfo);
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
