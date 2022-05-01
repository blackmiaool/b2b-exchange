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
                        <div>
                            <div :title="hash">{{ name }}</div>
                            <img v-if="imageBlobMap[name]" :src="imageBlobMap[name]" alt="" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="size" label="Size" width="180">
                    <template v-slot="{ row: { size } }">
                        <span>{{ filesize(size) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="othersTable" style="width: 100%">
                <el-table-column prop="name" label="Name" width="280"
                    ><template v-slot="{ row: { name, hash } }">
                        <div>
                            <div :title="hash">{{ name }}</div>
                            <img
                                v-if="imageBlobMap[name]"
                                :src="imageBlobMap[name]"
                                alt=""
                                style="max-width: 100%; max-height: 200px"
                            />
                        </div> </template
                ></el-table-column>
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
                            <el-button
                                v-if="!progressMap[file.name] && isText(file.name)"
                                type="warning"
                                @click="startPreview(file)"
                                style="margin-top: 10px"
                                ><i class="el-icon-download"></i> Preview</el-button
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
        <el-dialog
            title="Paste Image"
            :visible.sync="showPasteImageVisible"
            width="30%"
            :close-on-click-modal="false"
        >
            <span style="display: inline-block; margin-bottom: 15px"
                >Input the file name of your Image</span
            >
            <el-input
                placeholder="Please input file name"
                v-model="pastedItemName"
                style="margin-bottom: 15px"
            ></el-input>
            <el-button type="success" @click="generateFileName" style="">Generate</el-button>
            <img
                :src="pastedItem"
                style="max-width: 100%; max-height: 100%; display: block; margin: auto"
            />
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPaste">Cancel</el-button>
                <el-button type="primary" @click="confirmPaste" :disabled="!Boolean(pastedItemName)"
                    >Confirm</el-button
                >
            </span>
        </el-dialog>
        <el-dialog
            title="Paste Text"
            :visible.sync="showPasteTextVisible"
            width="30%"
            :close-on-click-modal="false"
            @close="cancelPaste"
        >
            <span style="display: inline-block; margin-bottom: 15px"
                >Input the file name of your text</span
            >
            <el-input
                placeholder="Please input file name"
                v-model="pastedItemName"
                style="margin-bottom: 15px"
            ></el-input>
            <el-button type="success" @click="generateFileName" style="">Generate</el-button>
            <div>
                {{ pastedItem }}
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelPaste">Cancel</el-button>
                <el-button type="primary" @click="confirmPaste" :disabled="!Boolean(pastedItemName)"
                    >Confirm</el-button
                >
            </span>
        </el-dialog>
        <el-dialog
            :title="`Preview ${previewingTextFileName}`"
            :visible.sync="showTextPreview"
            @close="closeTextPreview"
            width="30%"
        >
            <div>
                <textarea cols="30" rows="10" :value="previewingText" readonly></textarea>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="copyPreviewingText">Copy</el-button>
                <el-button type="default" @click="showTextPreview = false">Confirm</el-button>
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
import { getBlobType, isImage, isText } from "../common/utils";

export default Vue.extend({
    name: "RoomComp",
    props: {
        room: Object,
        othersInfo: Array
    },
    data() {
        return {
            previewingTextFileName: "",
            showTextPreview: false,
            previewingText: "",
            showPasteTextVisible: false,
            pastedBlob: null,
            pastedItem: "",
            showPasteImageVisible: false,
            imageBlobMap: {},
            othersTable: [],
            files: [],
            showPasswordDialogVisible: false,
            progressMap: {},
            pastedItemName: "",
            imageSuffixMap: {
                jpg: true,
                jpeg: true,
                webp: true,
                png: true,
                gif: true
            }
        };
    },
    mounted() {
        document.onpaste = event => {
            const items = event.clipboardData.items;
            const pastedText = event.clipboardData.getData("Text");
            if (pastedText) {
                this.pastedItem = pastedText;
                this.showPasteTextVisible = true;
                this.pastedBlob = new Blob([pastedText]);
                return;
            }
            if (!items.length) {
                return;
            }
            for (const index in items) {
                const item = items[index];
                if (item.kind === "file") {
                    const blob = item.getAsFile();
                    this.pastedBlob = blob;
                    const reader = new FileReader();
                    reader.onload = event => {
                        this.pastedItem = event.target.result;
                        this.showPasteImageVisible = true;
                    };
                    reader.readAsDataURL(blob);
                }
            }
        };
    },
    computed: {
        roomHash() {
            if (!this.room) {
                return "";
            }
            return hash(this.room.roomPassword, config.roomSalt);
        }
    },
    methods: {
        isImage,
        isText,
        ...mapActions(["safeRequest", "download"]),
        closeTextPreview() {
            this.previewingTextFileName = "";
        },
        copyPreviewingText() {
            navigator.clipboard.writeText(this.previewingText);
        },
        generateFileName() {
            const randomNumber = Math.floor(Math.random() * 1e6);
            this.pastedItemName = String(randomNumber);
        },
        cancelPaste() {
            this.pastedItem = "";
            this.pastedItemName = "";
            this.showPasteTextVisible = false;
            this.showPasteImageVisible = false;
        },
        confirmPaste() {
            if (this.showPasteImageVisible) {
                const base64 = this.pastedItem;
                const suffix = base64.slice(0, 20).match(/\/(\w+)/)?.[1] || "";

                const file = new File([this.pastedBlob], `${this.pastedItemName}.${suffix}`, {
                    type: `image/${getBlobType(`a.${suffix}`)}`,
                    lastModified: Date.now()
                });
                this.$refs.uspload.add(file);
                this.cancelPaste();
            } else if (this.showPasteTextVisible) {
                const file = new File([this.pastedBlob], `${this.pastedItemName}.txt`, {
                    type: `text/plain`,
                    lastModified: Date.now()
                });
                this.$refs.uspload.add(file);
                this.cancelPaste();
            }
        },
        async startPreview(file) {
            if (this.previewingTextFileName) {
                return;
            }
            this.previewingTextFileName = file.name;
            const blob = await this.fetchBlob(file);
            if (this.isText(file.name)) {
                const text = await blob.text();
                this.previewingText = text;
                this.showTextPreview = true;
            }
        },
        async fetchBlob(file) {
            this.$set(this.progressMap, file.name, 0.000001);
            const blob = (await this.download({
                roomHash: this.roomHash,
                roomPassword: this.room.roomPassword,
                fileName: file.name,
                fileSize: file.size,
                from: file.id,
                onProgress: progress => {
                    this.$set(this.progressMap, file.name, progress);
                    console.log("on", progress);
                }
            })) as Blob;
            this.$delete(this.progressMap, file.name);
            return blob;
        },
        async startDownload(file) {
            const blob = await this.fetchBlob(file);
            if (this.isImage(file.name)) {
                const reader = new FileReader();
                reader.addEventListener("loadend", () => {
                    const contents = reader.result;
                    this.$set(this.imageBlobMap, file.name, contents);
                });
                if (blob instanceof Blob) reader.readAsDataURL(blob);
            } else {
                this.downloadBlob(blob, file.name);
            }
        },
        downloadBlob(blob, name = "file.txt") {
            // For other browsers:
            // Create a link pointing to the ObjectURL containing the blob.
            const data = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = data;
            link.download = name;

            // this is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            );

            setTimeout(() => {
                // For Firefox it is necessary to delay revoking the ObjectURL
                window.URL.revokeObjectURL(data);
                link.remove();
            }, 100);
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
