<template>
    <div style="padding: 20px">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="Server Origin">
                <el-input v-model="form.origin"></el-input>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="onSubmit">Save</el-button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import config, { saveConfig } from "../config-loader";

export default Vue.extend({
    name: "HomeSettings",
    mounted() {
        this.form = JSON.parse(JSON.stringify(config));
    },
    methods: {
        onSubmit() {
            console.log(this.form);
            saveConfig(this.form);
        }
    },
    data() {
        return {
            form: {
                origin: ""
            }
        };
    },
    components: {}
});
</script>
<style>
</style>
