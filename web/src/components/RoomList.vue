<template>
    <div
        class="room-list"
        style="background-color: rgb(84, 92, 100); height: 100%; position: relative"
    >
        <header>
            <section class="room-tab"></section>
        </header>
        <main>
            <ul style="margin: 0; color: white; padding: 0">
                <li
                    :class="{
                        active: selected ? li.roomName === selected.roomName : false,
                        'menu-li': true
                    }"
                    v-for="(li, index) in roomList"
                    :key="index"
                    @click="onSelect(index)"
                >
                    <i class="el-icon-menu"></i> {{ li.roomName }}
                </li>
            </ul>
        </main>
        <footer style="position: absolute; left: 0; right: 0; bottom: 0">
            <i
                class="el-icon-setting"
                style="
                    position: absolute;
                    left: 5px;
                    bottom: 45px;
                    color: white;
                    font-size: 45px;
                    cursor: pointer;
                "
                @click="onSettings"
            ></i>
            <el-button
                type="primary"
                @click="addRoom"
                style="width: 50%; position: absolute; left: 0; bottom: 0"
                >Add</el-button
            >
            <el-button
                type="danger"
                @click="deleteRoom"
                style="width: 50%; position: absolute; right: 0; bottom: 0"
                >Delete</el-button
            >
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
import { hash } from "../common/crypto";
import config from "../config-loader";
import Vue from "vue";

export default {
    name: "RoomList",
    data() {
        return {
            configKey: "b2b-exchange-room-list",
            roomList: [],
            roomName: "",
            roomPassword: "",
            dialogVisible: false,
            selected: null
        };
    },
    created() {
        this.initConfig();
    },
    mounted() {
        if (this.roomList.length) {
            this.onSelect(0);
        }
    },
    methods: {
        onSettings() {
            this.onSelect(null);
            this.$emit("settings");
        },
        onSelect(index) {
            if (index === null || index === undefined) {
                this.selected = null;
                this.$emit("select", null);
            } else {
                this.selected = this.roomList[index];
                const roomHash = hash(this.selected.roomPassword, config.roomSalt);
                this.$emit("select", { ...this.selected, hash: roomHash });
            }
            console.log("on select", index);
        },
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

            this.$emit("roomList", this.roomList);
            if (!this.selected) {
                this.onSelect(0);
            }
            console.log("on confirm", this.selected);
            this.roomName = "";
            this.roomPassword = "";
        },
        initConfig() {
            try {
                const config = localStorage.getItem(this.configKey);
                this.roomList = JSON.parse(config) || [];
            } catch (e) {
                this.roomList = [];
            }
            this.$emit("roomList", this.roomList);
        },
        syncConfig() {
            localStorage.setItem(this.configKey, JSON.stringify(this.roomList));
        },
        addRoom() {
            this.dialogVisible = true;
        },
        deleteRoom() {
            this.$confirm(`Are you sure to delete room "${this.selected.roomName}"?`)
                .then(() => {
                    this.roomList = this.roomList.filter(({ roomName }) => {
                        return this.selected.roomName !== roomName;
                    });
                    // if (this.roomList.length) {
                    //     this.onSelect(0);
                    // }
                    this.syncConfig();
                    if (!this.roomList.length) {
                        this.onSelect(null);
                    } else {
                        Vue.nextTick(() => {
                            (
                                document.querySelector(".room-list li[role='menuitem']") as any
                            )?.click();
                        });
                    }
                })
                .catch(() => {});
        },
        handleClose(done) {
            this.$confirm("Are you sure to close this dialog?")
                .then(() => {
                    done();
                })
                .catch(() => {});
        }
    }
};
</script>
<style>
.menu-li {
    list-style: none;
    padding: 15px 0px 15px 20px;
    cursor: pointer;
}
.menu-li.active {
    color: rgb(255, 208, 75);
}

.menu-li:hover {
    background-color: rgba(67, 74, 80);
}
</style>
