<template>
    <div style="background-color: rgb(84, 92, 100); height: 100%; position: relative">
        <header>
            <section class="room-tab"></section>
        </header>
        <main>
            <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
            >
                <el-menu-item
                    v-for="(room, i) in roomList"
                    :key="room.roomName"
                    class="clickable room-title"
                    :index="i"
                >
                    <i class="el-icon-menu"></i>
                    <span>{{ room.roomName }}</span>
                </el-menu-item>
            </el-menu>
        </main>
        <footer style="position: absolute; left: 0; right: 0; bottom: 0">
            <el-button type="primary" @click="addRoom">Add</el-button>
        </footer>
        <el-dialog
            title="Add Room"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose"
        >
            <span>Room Name</span>
            <el-input placeholder="Please input" v-model="roomName"></el-input>
            <span>Room Password</span>
            <el-input placeholder="Please input" v-model="roomPassword"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="onConfirmAddRoom">Confirm</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import crypto from "crypto-js";
function hash(message) {
    return crypto.SHA512(message).toString();
}
console.log(crypto.AES.encrypt("a", "b").toString());
console.log(hash("123"));
export default {
    name: "RoomList",
    data() {
        return {
            configKey: "b2b-exchange-config",
            roomList: [],
            roomName: "",
            roomPassword: "",
            dialogVisible: false
        };
    },
    mounted() {
        this.initConfig();
    },
    methods: {
        onConfirmAddRoom() {
            if (!this.roomName || !this.roomPassword) {
                this.$alert("no name or no pwd");
                return;
            }
            if (this.roomPassword.length < 6) {
                this.$alert("pass word too short");
                return;
            }
            this.roomList.push({
                roomName: this.roomName,
                roomPassword: this.roomPassword
            });
            this.syncConfig();
            this.dialogVisible = false;
        },
        initConfig() {
            try {
                const config = localStorage.getItem(this.configKey);
                this.roomList = JSON.parse(config) || [];
            } catch (e) {
                this.roomList = [];
            }
            console.log(this.roomList);
        },
        syncConfig() {
            localStorage.setItem(this.configKey, JSON.stringify(this.roomList));
        },
        addRoom() {
            console.log("add room");
            this.dialogVisible = true;
        },
        handleClose(done) {
            this.$confirm("Are you sure to close this dialog?")
                .then(_ => {
                    done();
                })
                .catch(() => {});
        }
    },
    components: {}
};
</script>
<style>
.room-title:hover {
}
</style>
