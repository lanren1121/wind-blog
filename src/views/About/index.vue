<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <div class="text-center mb-12">
      <div class="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-6 flex items-center justify-center text-white text-6xl font-bold">
        A
      </div>
      <h1 class="text-4xl font-bold text-gray-800 mb-4">关于我</h1>
      <p class="text-xl text-gray-600">一名热爱技术的开发者</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">自我介绍</h2>
      <div class="prose max-w-none">
        <p class="text-gray-700 mb-4">
          大家好，我是 <strong>Admin</strong>，一名专注于前端开发的技术爱好者。我对新技术充满热情，
          喜欢通过写作来分享自己的学习心得和技术经验。
        </p>
        <p class="text-gray-700 mb-4">
          在过去的几年里，我参与了多个项目开发，积累了丰富的实战经验。我擅长使用 Vue.js、React 等前端框架，
          也熟悉 Node.js 后端开发，致力于全栈技术的学习和实践。
        </p>
        <p class="text-gray-700">
          我相信技术改变世界，代码创造价值。希望通过这个博客平台，能够与更多志同道合的朋友交流学习，
          共同进步。
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">技能栈</h3>
        <ul class="space-y-3">
          <li class="flex justify-between items-center pb-2 border-b border-gray-100">
            <span class="font-medium">Vue.js</span>
            <div class="w-24 bg-gray-200 rounded-full h-2">
              <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style="width: 90%"></div>
            </div>
          </li>
          <li class="flex justify-between items-center pb-2 border-b border-gray-100">
            <span class="font-medium">JavaScript</span>
            <div class="w-24 bg-gray-200 rounded-full h-2">
              <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style="width: 85%"></div>
            </div>
          </li>
          <li class="flex justify-between items-center pb-2 border-b border-gray-100">
            <span class="font-medium">React</span>
            <div class="w-24 bg-gray-200 rounded-full h-2">
              <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style="width: 80%"></div>
            </div>
          </li>
          <li class="flex justify-between items-center pb-2 border-b border-gray-100">
            <span class="font-medium">Node.js</span>
            <div class="w-24 bg-gray-200 rounded-full h-2">
              <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style="width: 75%"></div>
            </div>
          </li>
          <li class="flex justify-between items-center">
            <span class="font-medium">Python</span>
            <div class="w-24 bg-gray-200 rounded-full h-2">
              <div class="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" style="width: 70%"></div>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">联系我</h3>
        <div class="space-y-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <span>admin@example.com</span>
          </div>
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clip-rule="evenodd" />
              </svg>
            </div>
            <span>github.com/username</span>
          </div>
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clip-rule="evenodd" />
              </svg>
            </div>
            <span>LinkedIn Profile</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm p-8">
      <h3 class="text-xl font-bold text-gray-800 mb-6">我的项目</h3>
      <div class="space-y-6">
        <div class="border-l-4 border-blue-500 pl-4 py-1">
          <h4 class="font-semibold text-lg text-gray-800">个人博客系统</h4>
          <p class="text-gray-600 mt-1">使用 Vue 3 + Vite 构建的现代化个人博客平台，支持响应式设计和流畅的动画效果。</p>
        </div>
        <div class="border-l-4 border-purple-500 pl-4 py-1">
          <h4 class="font-semibold text-lg text-gray-800">任务管理系统</h4>
          <p class="text-gray-600 mt-1">基于 Vue 3 和 Pinia 的任务管理应用，具有拖拽排序、标签分类等功能。</p>
        </div>
        <div class="border-l-4 border-green-500 pl-4 py-1">
          <h4 class="font-semibold text-lg text-gray-800">在线学习平台</h4>
          <p class="text-gray-600 mt-1">前后端分离的学习管理系统，包含课程管理、视频播放、进度跟踪等功能。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
};
</script>