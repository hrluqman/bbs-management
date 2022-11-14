<template>
  <BBSHeader />
  <main>
    <BBSMenu />
    <BBSRegisterForm menu="Member Register" />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BBSHeader from '../../components/BBSHeader.vue';
import BBSMenu from '../../components/BBSMenu.vue';
import BBSRegisterForm from '../../components/BBSRegisterForm.vue';

export default defineComponent({
  name: 'App',
  components: {
    BBSHeader,
    BBSMenu,
    BBSRegisterForm
  }
});
</script>