<template>
    <div style="background-color: rgb(84, 92, 100); height: 100%; position: relative">
        <header>
            <section class="room-tab"></section>
        </header>
        <main>
            <el-menu
                default-active="0"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                @select="onSelect"
            >
                <el-menu-item
                    v-for="(room, i) in roomList"
                    :key="room.roomName"
                    class="clickable room-title"
                    :index="String(i)"
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
export default {
    name: "RoomList",
    data() {
        return {
            configKey: "b2b-exchange-config",
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
        this.onSelect(0);
    },
    methods: {
        onSelect(index) {
            console.log("on", this.roomList, index);
            this.selected = this.roomList[index];
            this.$emit("select", this.selected);
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
        handleClose(done) {
            this.$confirm("Are you sure to close this dialog?")
                .then(() => {
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
