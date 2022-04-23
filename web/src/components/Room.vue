<template>
    <div class="room" style="height: 100%; padding: 20px; box-sizing: border-box">
        <div style="position: relative">
            <span v-if="room" style="font-size: 30px; font-weight: bold">{{ room.roomName }}</span>
            <el-button
                type="danger"
                @click="showPassword"
                style="position: absolute; right: 0; top: 0"
                >Show Password</el-button
            >
        </div>

        <file-upload
            class="btn btn-primary"
            post-action="/upload/post"
            :multiple="true"
            :drop="true"
            :drop-directory="true"
            @input="onFiles"
            :value="files"
            ref="uspload"
        >
            <el-button type="primary"><i class="el-icon-upload"></i> Upload</el-button>
        </file-upload>
        <div>
            <el-table :data="files" style="width: 100%">
                <el-table-column prop="name" label="Name" width="280"> </el-table-column>
                <el-table-column prop="size" label="Size" width="180">
                    <template v-slot="{ row: { size } }">
                        <span>{{ filesize(size) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="othersTable" style="width: 100%">
                <el-table-column prop="name" label="Name" width="280"> </el-table-column>
                <el-table-column prop="size" label="Size" width="180">
                    <template v-slot="{ row: { size } }">
                        <span>{{ filesize(size) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="From" width="180">
                    <template v-slot="{ row: { id } }">
                        <span :title="id">{{ id.slice(0, 10) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Action" width="180">
                    <template v-slot="{ row: { name, id, size } }">
                        <el-button type="primary" @click="startDownload(name, id, size)"
                            ><i class="el-icon-download"></i> Download</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog title="Tips" :visible.sync="showPasswordDialogVisible" width="30%">
            <span v-if="room">{{ room.roomPassword }}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showPasswordDialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="copyPassword">Copy</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import filesize from "filesize";
import Vue from "vue";
import FileUpload from "vue-upload-component";
import { decrypt, hash } from "../common/crypto";
import config from "../config";
import { mapActions } from "vuex";

export default Vue.extend({
    name: "RoomComp",
    props: {
        room: Object,
        othersInfo: Array
    },
    mounted() {},
    computed: {
        roomHash() {
            if (!this.room) {
                return "";
            }
            return hash(this.room.roomPassword, config.roomSalt);
        },
        othersTable() {
            if (!this.othersInfo) {
                return [];
            }
            return this.othersInfo
                .filter(other => {
                    return other.hash === this.roomHash;
                })
                .reduce((p, v) => {
                    if (v.room.files) {
                        const files = JSON.parse(decrypt(v.room.files, this.room.roomPassword));
                        files.forEach(file => {
                            p.push(
                                Object.assign({}, file, {
                                    id: v.id
                                })
                            );
                        });
                    }

                    return p;
                }, []);
        }
    },
    methods: {
        ...mapActions(["safeRequest", "download"]),
        startDownload(fileName, from, fileSize) {
            this.download({
                roomHash: this.roomHash,
                roomPassword: this.room.roomPassword,
                fileName,
                fileSize,
                from
            });
        },
        setFiles(files) {
            this.files = files;
        },
        onFiles(files) {
            this.$emit("filesChange", files);
            this.files = files;
        },
        showPassword() {
            this.showPasswordDialogVisible = true;
        },
        copyPassword() {
            navigator.clipboard.writeText(this.room.roomPassword);
            this.showPasswordDialogVisible = false;
        },
        filesize
    },
    data() {
        return {
            files: [],
            showPasswordDialogVisible: false
        };
    },
    watch: {
        // files(files) {
        //     console.log(files);
        // }
    },
    components: {
        FileUpload
    }
});
</script>
<style>
.room {
    /* max-width: 800px; */
}
</style>
