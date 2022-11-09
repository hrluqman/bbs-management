<template>
  <BBSHeader />
  <main>
    <BBSMenu />
    <BBSForm menu="BBS Register" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BBSHeader from '../../components/BBSHeader.vue';
import BBSMenu from '../../components/BBSMenu.vue';
import BBSForm from '../../components/BBSForm.vue';

export default defineComponent({
  name: 'App',
  components: {
    BBSHeader,
    BBSMenu,
    BBSForm
  }
});
</script>