<template>
  <BBSHeader />
  <main>
    <BBSMenu />
    <BBSList menu="BBS List"/>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BBSHeader from '../../components/BBSHeader.vue';
import BBSMenu from '../../components/BBSMenu.vue';
import BBSList from '../../components/BBSList.vue';

export default defineComponent({
  name: 'App',
  components: {
    BBSHeader,
    BBSMenu,
    BBSList
  }
});
</script>