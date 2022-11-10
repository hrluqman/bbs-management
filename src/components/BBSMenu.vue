<template>
    <div class="menu-container" :class="{openmenu : menuOpen}">
        <img class="sidemenu-icon" src="../assets/menu.png" alt="menu" @click="openSideMenu">
        <div class="menu-content" :class="{showmenu : menuOpen}" v-for="menu in menus" :key="menu.menuName">
            <label for="BBS">{{menu.menuName}}</label>
            <ul>
                <li v-for="sub in menu.subMenus" :key="sub.menuName">&nbsp;<router-link :to="sub.url">{{ sub.menuName }}</router-link></li>
            </ul>
        </div>
    </div>
    <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data() {
        return {
            menus: [],
            menuOpen: false as boolean
        }
    },
    methods: {
        openSideMenu() {
            console.log("OK");
            this.menuOpen = !this.menuOpen;
        }
    },
    mounted() {
        fetch('http://public.flexink.com:9250/api/public/menu/hierarchy')
        .then(res => res.json())
        .then(data => this.menus = data)
        .catch(err=>alert(err.message))
    }
})
</script>