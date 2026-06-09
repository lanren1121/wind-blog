import { onMounted } from 'vue';
import gsap from 'gsap';

// 页面入场动效封装
export const useTransition = () => {
  const animatePageEnter = (element, options = {}) => {
    const {
      duration = 0.8,
      delay = 0,
      ease = 'power2.out',
      y = 30,
      opacity = 0
    } = options;

    gsap.fromTo(
      element,
      { y, opacity },
      { 
        y: 0, 
        opacity: 1, 
        duration, 
        delay,
        ease 
      }
    );
  };

  const animateElementsSequentially = (elements, options = {}) => {
    const {
      duration = 0.6,
      stagger = 0.1,
      ease = 'power2.out',
      y = 20,
      opacity = 0
    } = options;

    gsap.fromTo(
      elements,
      { y, opacity },
      { 
        y: 0, 
        opacity: 1, 
        duration,
        stagger,
        ease,
        delay: 0.1
      }
    );
  };

  const fadeAndScale = (element, options = {}) => {
    const {
      duration = 0.6,
      delay = 0,
      ease = 'back.out(1.7)'
    } = options;

    gsap.fromTo(
      element,
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration, 
        delay,
        ease 
      }
    );
  };

  return {
    animatePageEnter,
    animateElementsSequentially,
    fadeAndScale
  };
};

// 在组件挂载时应用默认动画
export const useDefaultPageAnimation = () => {
  onMounted(() => {
    // 对页面主要元素应用渐入动画
    const mainElements = document.querySelectorAll('header, main > *, footer');
    if (mainElements.length > 0) {
      mainElements.forEach((el, i) => {
        gsap.fromTo(el, 
          { y: 20, opacity: 0 }, 
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            delay: i * 0.1, 
            ease: 'power2.out' 
          }
        );
      });
    }
  });
};