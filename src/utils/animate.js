import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

// 动画工具封装
const animateUtils = {
  // 基础淡入动画
  fadeIn(element, duration = 0.6, delay = 0) {
    gsap.fromTo(
      element,
      { opacity: 0 },
      { 
        opacity: 1, 
        duration, 
        delay,
        ease: 'power2.out'
      }
    );
  },

  // 从下方滑入并淡入
  slideInFromBottom(element, duration = 0.8, delay = 0) {
    gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration, 
        delay,
        ease: 'power2.out'
      }
    );
  },

  // 从左侧滑入
  slideInFromLeft(element, duration = 0.6, delay = 0) {
    gsap.fromTo(
      element,
      { x: -30, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration, 
        delay,
        ease: 'power2.out'
      }
    );
  },

  // 从右侧滑入
  slideInFromRight(element, duration = 0.6, delay = 0) {
    gsap.fromTo(
      element,
      { x: 30, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration, 
        delay,
        ease: 'power2.out'
      }
    );
  },

  // 缩放动画
  scaleIn(element, duration = 0.6, delay = 0) {
    gsap.fromTo(
      element,
      { scale: 0.8, opacity: 0 },
      { 
        scale: 1, 
        opacity: 1, 
        duration, 
        delay,
        ease: 'back.out(1.7)'
      }
    );
  },

  // 滚动触发动画
  scrollAnimation(triggerElement, targetElement, animationType = 'fadeIn') {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: 'top 80%',
      onEnter: () => {
        switch(animationType) {
          case 'fadeIn':
            this.fadeIn(targetElement);
            break;
          case 'slideInFromBottom':
            this.slideInFromBottom(targetElement);
            break;
          case 'slideInFromLeft':
            this.slideInFromLeft(targetElement);
            break;
          case 'slideInFromRight':
            this.slideInFromRight(targetElement);
            break;
          case 'scaleIn':
            this.scaleIn(targetElement);
            break;
          default:
            this.fadeIn(targetElement);
        }
      },
      once: true
    });
  },

  // 弹跳效果
  bounce(element, duration = 0.5) {
    gsap.to(element, {
      y: -10,
      duration: duration / 2,
      yoyo: true,
      repeat: 1,
      ease: 'bounce.out'
    });
  },

  // 抖动效果
  shake(element, duration = 0.5) {
    gsap.to(element, {
      x: [-10, 10, -8, 8, -5, 5, -2, 2, 0],
      duration: duration,
      ease: 'power2.inOut'
    });
  },

  // 文字逐个字母动画
  textAnimation(element, duration = 0.05) {
    const letters = element.textContent.split('');
    element.innerHTML = letters.map(letter => `<span>${letter}</span>`).join('');
    
    const spans = element.querySelectorAll('span');
    spans.forEach((span, i) => {
      gsap.fromTo(span, 
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5,
          delay: i * duration,
          ease: 'power2.out'
        }
      );
    });
  }
};

export default animateUtils;