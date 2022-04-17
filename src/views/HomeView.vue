<template>
    <div class="home" style="height: 100%; display: flex">
        <div class="left" style="height: 100%; max-width: 300px; width: 30%; flex: 1">
            <RoomList @select="onSelect" />
        </div>
        <div class="right" style="height: 100%; flex: 1">
            <Room  :room="room"/>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import RoomList from "../components/RoomList.vue";
import Room from "../components/Room.vue";
export default Vue.extend({
    name: "HomeView",
    data() {
        return {
            room: null
        };
    },
    methods: {
        onSelect(room) {
            this.room = room;
        }
    },
    components: {
        RoomList,
        Room
    }
});
</script>
<style>
.home {
    /* max-width: 800px; */
}
</style>
