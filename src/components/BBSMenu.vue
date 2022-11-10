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
                let data = await fetch('http://public.flexink.com:9250/api/public/menu/hierarchy');
                if(!data.ok) throw Error('No Data Available');
                menus.value = await data.json();
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