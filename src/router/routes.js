import MainLayout from '@/components/layout/MainLayout.vue';

// 路由表：首页/文章/写作/分类/标签/归档/关于
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home/index.vue')
      },
      {
        path: '/articles',
        name: 'ArticleList',
        component: () => import('@/views/Article/List.vue')
      },
      {
        path: '/article/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/Article/Detail.vue'),
        props: true
      },
      {
        path: '/write',
        name: 'ArticleEditor',
        component: () => import('@/views/Article/Editor.vue')
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Auth/Login.vue')
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Auth/Register.vue')
      },
      {
        path: '/profile',
        name: 'Profile',
        component: () => import('@/views/Auth/Profile.vue')
      },
      {
        path: '/category',
        name: 'Category',
        component: () => import('@/views/Category/index.vue')
      },
      {
        path: '/tag',
        name: 'Tag',
        component: () => import('@/views/Tag/index.vue')
      },
      {
        path: '/archive',
        name: 'Archive',
        component: () => import('@/views/Archive/index.vue')
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/About/index.vue')
      }
    ]
  },
  {
    path: '/article',
    redirect: '/articles'
  }
];

export default routes;
