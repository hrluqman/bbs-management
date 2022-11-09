<template>
  <BBSHeader />
  <main>
    <BBSMenu />
    <div class="form-container not-found d-flex flex-column">
        <img src="../assets/empty.svg" alt="empty">
        <h1>404</h1>
        <h2>Page Not Found</h2>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BBSHeader from '../components/BBSHeader.vue';
import BBSMenu from '../components/BBSMenu.vue';

export default defineComponent({
    name: 'NotFound',
    components: {
        BBSHeader,
        BBSMenu
    }
})
</script>

<style lang="scss" scoped>
    .not-found {
        margin-top: 4rem;
        h1, h2 {
            text-align: center;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            margin-top: 2rem;
        }
        h2 {
            margin-top: 1rem;
        }
        img {
            width: 50%;
            max-width: 20rem;
            margin: 0 auto;
        }
    }
</style>