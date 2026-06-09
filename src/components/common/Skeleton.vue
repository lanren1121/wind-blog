<template>
  <div class="animate-pulse">
    <div v-if="type === 'text'" :class="['bg-gray-200 rounded', sizeClass]" />
    <div v-else-if="type === 'rect'" :class="['bg-gray-200 rounded', sizeClass]" />
    <div v-else-if="type === 'circle'" :class="['bg-gray-200 rounded-full', sizeClass]" />
    <div v-else :class="['bg-gray-200 rounded', sizeClass]" />
  </div>
</template>

<script>
export default {
  name: 'Skeleton',
  props: {
    type: {
      type: String,
      default: 'text',
      validator: value => ['text', 'rect', 'circle'].includes(value)
    },
    width: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md',
      validator: value => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    }
  },
  computed: {
    sizeClass() {
      const sizeMap = {
        xs: 'h-3 w-16',
        sm: 'h-4 w-24',
        md: 'h-5 w-32',
        lg: 'h-6 w-40',
        xl: 'h-8 w-48'
      };
      
      let classes = sizeMap[this.size];
      
      if (this.width) {
        classes = classes.replace(/w-\d+/, `w-[${this.width}]`);
      }
      
      if (this.height) {
        classes = classes.replace(/h-\d+/, `h-[${this.height}]`);
      }
      
      return classes;
    }
  }
};
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>