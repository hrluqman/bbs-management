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
import axios from 'axios';
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
    setup() {
        const menus = ref([]);
        const menuOpen = ref(false);

        const openSideMenu = () => {
            menuOpen.value = !menuOpen.value;
        }

        const initMenu = async () => {
            try {
                const data = await axios.get(`${process.env.VUE_APP_SERVICE_URL}menu/hierarchy`)
                if(data.status!=200) throw Error('No Data Available');
                menus.value = data.data;
            }
            catch (error) {
                if (error instanceof Error) alert(error.message);
                else alert(String(error));
            }
        }

        onMounted(()=> initMenu())

        return { menus, menuOpen, openSideMenu }
    }
})
</script>