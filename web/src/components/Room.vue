<template>
    <div class="room" style="height: 100%; padding: 20px; box-sizing: border-box; overflow: auto">
        <div style="position: relative">
            <span v-if="room" style="font-size: 30px; font-weight: bold" :title="roomHash">{{
                room.roomName
            }}</span>
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
                <el-table-column prop="name" label="Name" width="280">
                    <template v-slot="{ row: { name, hash } }">
                        <span :title="hash">{{ name }}</span>
                    </template>
                </el-table-column>
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
                    <template v-slot="{ row: file }">
                        <div>
                            <el-button
                                v-if="!progressMap[file.name]"
                                type="primary"
                                @click="startDownload(file)"
                                ><i class="el-icon-download"></i> Download</el-button
                            >
                            <el-button v-if="progressMap[file.name]">{{
                                progressMap[file.name] | percentage
                            }}</el-button>
                        </div>
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
    data() {
        return { othersTable: [], files: [], showPasswordDialogVisible: false, progressMap: {} };
    },
    mounted() {},
    computed: {
        roomHash() {
            if (!this.room) {
                return "";
            }
            return hash(this.room.roomPassword, config.roomSalt);
        }
    },
    methods: {
        ...mapActions(["safeRequest", "download"]),
        async startDownload(file) {
            console.log("start download", file);
            this.$set(this.progressMap, file.name, 0.000001);
            await this.download({
                roomHash: this.roomHash,
                roomPassword: this.room.roomPassword,
                fileName: file.name,
                fileSize: file.size,
                from: file.id,
                onProgress: progress => {
                    this.$set(this.progressMap, file.name, progress);
                    console.log("on", progress);
                }
            });
            this.$delete(this.progressMap, file.name);
        },
        setFiles(files) {
            this.files = files;
        },
        onFiles(files) {
            const nameMap = {};
            this.files = files
                .map(file => {
                    if (!file.hash) {
                        file.hash = hash(file.name, config.fileSalt);
                    }
                    return file;
                })
                .filter(({ name }) => {
                    if (nameMap[name]) {
                        this.$message.error("found duplicated file name " + name);

                        return false;
                    }
                    nameMap[name] = true;
                    return true;
                });
            this.$emit("filesChange", this.files);
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
    watch: {
        othersInfo: {
            immediate: true,
            handler(othersInfo) {
                if (!othersInfo) {
                    this.othersTable = [];
                }
                this.othersTable = othersInfo.reduce((p, v) => {
                    if (v.room.files) {
                        const files = JSON.parse(decrypt(v.room.files, this.room.roomPassword));
                        files.forEach(file => {
                            p.push(
                                Object.assign(
                                    {
                                        progress: 0
                                    },
                                    file,
                                    {
                                        id: v.id
                                    }
                                )
                            );
                        });
                    }

                    return p;
                }, []);
            }
        }
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
