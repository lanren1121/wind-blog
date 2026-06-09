<template>
  <div class="min-h-screen flex flex-col">
    <!-- 导航栏 -->
    <NavBar />
    
    <!-- 主要内容区域 -->
    <main class="flex-grow pt-16">
      <router-view v-slot="{ Component, route }">
        <transition name="route" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    
    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script>
import NavBar from '@/components/common/NavBar.vue';
import Footer from '@/components/common/Footer.vue';

export default {
  name: 'MainLayout',
  components: {
    NavBar,
    Footer
  }
};
</script>