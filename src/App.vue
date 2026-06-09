<template>
  <div id="app">
    <MainLayout />
  </div>
</template>

<script>
import MainLayout from '@/components/layout/MainLayout.vue';

export default {
  name: 'App',
  components: {
    MainLayout
  }
};
</script>

<style>
@import '@/assets/css/global.css';
@import '@/assets/css/transition.css';
</style>