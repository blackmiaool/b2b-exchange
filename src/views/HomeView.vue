<template>
    <div class="home" style="height:100%;">
        <div class="left" style="height:100%;max-width:300px;width:30%;">
            <RoomList />
        </div>
        <div class="right"></div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import RoomList from "../components/RoomList.vue";

export default Vue.extend({
    name: "HomeView",
    methods: {},
    components: {
        RoomList
    }
});
</script>
<style>
.home {
    /* max-width: 800px; */
}
</style>
