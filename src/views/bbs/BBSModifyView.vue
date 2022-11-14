<template>
  <BBSHeader />
  <main>
    <BBSMenu />
    <BBSModifyForm menu="BBS Modify" :modify="modify" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BBSHeader from '../../components/BBSHeader.vue';
import BBSMenu from '../../components/BBSMenu.vue';
import BBSModifyForm from '../../components/BBSModifyForm.vue';

export default defineComponent({
  name: 'App',
  components: {
    BBSHeader,
    BBSMenu,
    BBSModifyForm
  },
  data() {
    return {
      modify: true
    }
  },
  props: ['id']
});
</script>