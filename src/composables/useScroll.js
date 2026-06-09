import { onMounted, onUnmounted } from 'vue';

// 平滑滚动封装
export function useScroll() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToElement = (selector, offset = 0) => {
    const element = document.querySelector(selector);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const isScrolling = () => {
    return new Promise(resolve => {
      let ticking = false;
      
      const onScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            resolve(true);
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });

      setTimeout(() => {
        window.removeEventListener('scroll', onScroll);
        resolve(false);
      }, 100);
    });
  };

  return {
    scrollToTop,
    scrollToElement,
    isScrolling
  };
}

// 监听滚动事件的 Hook
export function useScrollListener(callback) {
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
      ticking = true;
    }
  };

  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });

  return {
    handleScroll
  };
}