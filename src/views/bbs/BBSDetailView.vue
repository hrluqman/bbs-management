<template>
  <BBSHeader />
  <main>
    <BBSMenu />
    <BBSViewForm menu="BBS View" :viewing="viewing" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BBSHeader from '../../components/BBSHeader.vue';
import BBSMenu from '../../components/BBSMenu.vue';
import BBSViewForm from '../../components/BBSViewForm.vue';

export default defineComponent({
  name: 'App',
  components: {
    BBSHeader,
    BBSMenu,
    BBSViewForm
  },
  data() {
    return {
      viewing: true
    }
  },
  props: ['id']
});
</script>