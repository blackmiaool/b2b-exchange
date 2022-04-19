<template>
    <div class="room" style="height: 100%; padding: 20px">
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
            <el-button type="primary">
                <i class="el-icon-upload"></i> Upload</el-button
            >
        </file-upload>
        <div>
            <el-table :data="files" style="width: 100%">
                <el-table-column prop="name" label="Name" width="180">
                    <!-- <template v-slot="{ row: { name, size } }">
                        <div>
                            <el-table-column prop="name" label="Name" width="180">
                            </el-table-column>
                            <el-table-column prop="address" label="Address"> </el-table-column>
                        </div>
                    </template> -->
                </el-table-column>
                <el-table-column prop="name" label="Name" width="180">
                    <template v-slot="{ row: { size } }">
                        <span>{{ filesize(size) }}</span>
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

export default Vue.extend({
    name: "RoomComp",
    props: {
        room: Object
    },
    methods: {
        onFiles(files) {
            console.log(files);
            this.$emit("filesChange", files);
            this.files = files;
        },
        showPassword() {
            console.log("show");
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
