import { tr } from "element-plus/es/locale";
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";

export const Layout = () => import("@/layout/index.vue");

// 静态路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },

  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },
  {
    path: "/reviewer-login",
    component: () => import("@/views/login/reviewerLogin.vue"),
    meta: { hidden: true },
  },

  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      //儀錶板
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
        // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
        meta: {
          title: "dashboard",
          icon: "homepage",
          affix: true,
          keepAlive: true,
          alwaysShow: false,
        },
      },

      //401錯誤
      {
        path: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: { hidden: true },
      },
      //404錯誤
      {
        path: "404",
        component: () => import("@/views/error-page/404.vue"),
        meta: { hidden: true },
      },
    ],
  },
  //系統設定，沒子目錄，器捐協會沒有設定

  //小腸協會,會員的審核及列表
  // {
  //   path: "/member",
  //   component: Layout,
  //   name: "member", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
  //   // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
  //   meta: {
  //     title: "會員管理",
  //     icon: "el-icon-Avatar",
  //     //affix: true,
  //     keepAlive: true,
  //     alwaysShow: false,
  //     hidden: isReviewer,
  //   },
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("@/views/member/index.vue"),
  //       name: "memberPage",
  //       meta: {
  //         title: "會員列表",
  //         icon: "el-icon-Avatar",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     {
  //       path: "review",
  //       component: () => import("@/views/member/review.vue"),
  //       name: "memberReview",
  //       meta: {
  //         title: "繳費審核",
  //         icon: "el-icon-Finished",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     {
  //       path: "attendees",
  //       component: () => import("@/views/member/attendees.vue"),
  //       name: "attendees",
  //       meta: {
  //         title: "與會者管理",
  //         icon: "el-icon-Finished",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //   ],
  // },

  //小腸協會,信件的模板及寄信



];

export const adminDynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/member",
    component: Layout,
    name: "member",

    meta: {
      title: "會員管理",
      icon: "el-icon-Avatar",
      keepAlive: true,
      alwaysShow: false,
    },
    children: [
      {
        path: "/member-page",
        component: () => import("@/views/member/index.vue"),
        name: "memberPage",
        meta: {
          title: "會員列表",
          icon: "el-icon-Avatar",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "review",
        component: () => import("@/views/member/review.vue"),
        name: "memberReview",
        meta: {
          title: "繳費審核",
          icon: "el-icon-Finished",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "attendees",
        component: () => import("@/views/member/attendees.vue"),
        name: "attendees",
        meta: {
          title: "與會者管理",
          icon: "el-icon-Finished",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ]
  },
  {
    path: "/mail-center",
    component: Layout,
    name: "mailCenter", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
    // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
    meta: {
      title: "E-Mail 中心",
      icon: "el-icon-Message",
      //affix: true,
      keepAlive: true,
      alwaysShow: false,
      hidden: false,
    },
    children: [
      {
        path: "",
        component: () => import("@/views/email-center/index.vue"),
        name: "emailTemplate",
        meta: {
          title: "E-Mail模板",
          icon: "el-icon-Grid",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "/schedule-manage",
        component: () => import("@/views/email-center/emailScheduleManage.vue"),
        name: "emailTaskManage",
        meta: {
          title: "E-Mail任務管理",
          icon: "el-icon-Grid",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: ":id",
        component: () => import("@/views/email-center/emailTemplateItem.vue"),
        name: "EmailTemplateItem",
        props: true,
        meta: {
          title: "信件模板編輯",
          icon: "menu",
          hidden: true,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "email-send/:id",
        component: () => import("@/views/email-center/send.vue"),
        name: "emailSend",
        props: true,
        meta: {
          title: "信件發送",
          icon: "el-icon-Position",
          hidden: true,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/tags",
    component: Layout,
    name: "tags", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
    // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
    meta: {
      title: "標籤管理",
      icon: "el-icon-Message",
      //affix: true,
      keepAlive: true,
      alwaysShow: false,
      hidden: false,
    },
    children: [
      {
        path: "/tag-manage",
        component: () => import("@/views/tags/index.vue"),
        name: "tags-manage",
        meta: {
          title: "標籤管理",
          icon: "el-icon-PriceTag",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      }
    ],
  },
  {
    path: "/abstract",
    component: Layout,
    name: "abstract", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
    // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
    meta: {
      title: "稿件管理",
      icon: "el-icon-Message",
      //affix: true,
      keepAlive: true,
      alwaysShow: false,
      hidden: false,
    },
    children: [
      {
        path: "/abstract-manage",
        component: () => import("@/views/abstract/index.vue"),
        name: "abstract-manage",
        meta: {
          title: "稿件列表",
          icon: "el-icon-PriceTag",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "/distribution",
        component: () => import("@/views/abstract/distribution.vue"),
        name: "abstract-distribution1",
        meta: {
          title: "稿件分發",
          icon: "el-icon-PriceTag",
          hidden: true,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/abstract-reviewer",
    component: Layout,
    name: "abstract-reviewer", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
    // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
    meta: {
      title: "審稿委員管理",
      icon: "el-icon-Message",
      //affix: true,
      keepAlive: true,
      alwaysShow: false,
    },
    children: [
      {
        path: "/abstract-reviewer-manage",
        component: () => import("@/views/abstract-reviewer/index.vue"),
        name: "abstract-reviewer-manage",
        meta: {
          title: "審稿委員列表",
          icon: "el-icon-PriceTag",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "/review-status",
        component: () => import("@/views/abstract/reviewStatus.vue"),
        name: "abstract-reviewer-status",
        meta: {
          title: "審稿狀態",
          icon: "el-icon-PriceTag",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      }
    ],
  },
  {
    path: "/test",
    component: Layout,
    name: "test", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
    // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
    meta: {
      title: "測試",
      icon: "el-icon-Message",
      //affix: true,
      keepAlive: true,
      alwaysShow: false,
      hidden: true,
    },
    children: [
      {
        path: "",
        component: () => import("@/views/test-upload/index.vue"),
        name: "test1",
        meta: {
          title: "",
          icon: "el-icon-PriceTag",
          hidden: true,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: "/speaker",
    component: Layout,
    name: "speaker", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
    // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
    meta: {
      title: "受邀講者列表",
      icon: "el-icon-Message",
      //affix: true,
      keepAlive: true,
      alwaysShow: false,
      hidden: false,
    },
    children: [
      {
        path: "/speaker-list",
        component: () => import("@/views/invited-speaker/index.vue"),
        name: "speaker-list",
        meta: {
          title: "受邀講者列表",
          icon: "el-icon-Message",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },


  {
    path: "/news-content",
    component: Layout,
    redirect: "/news-content/news",
    name: "NewsContent",
    meta: {
      title: "信息看板-內容管理",
      icon: "el-icon-EditPen",
      hidden: false,
      roles: ["ADMIN"],
    },
    children: [
      /**最新消息路由,以及其編輯路由 */
      {
        path: "news",
        component: () => import("@/views/content/news/index.vue"),
        name: "NewsContentNews",
        meta: {
          title: "最新消息",
          icon: "menu",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "news/:id",
        component: () => import("@/views/content/news/NewsItem.vue"),
        name: "NewsContentNewsItem",
        props: true,
        meta: {
          title: "最新消息編輯",
          icon: "menu",
          hidden: true,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },

  //---------------------------
  {
    path: "/file-center",
    component: Layout,
    redirect: "/file-center/achievements",
    name: "FileCenter",
    meta: {
      title: "檔案管理",
      icon: "el-icon-EditPen",
      hidden: false,
      roles: ["ADMIN"],
    },
    children: [
      /**歷年成果(簽卡分析) 路由 */
      {
        path: "achievements",
        component: () => import("@/views/file-center/achievements/index.vue"),
        name: "FileCenterAchievements",
        meta: {
          title: "歷年成果(簽卡分析)",
          icon: "menu",
          hidden: true,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      /**器捐會刊路由 */
      {
        path: "journal",
        component: () => import("@/views/file-center/journal/index.vue"),
        name: "FileCenterJournal",
        meta: {
          title: "器捐會刊",
          icon: "menu",
          hidden: true,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "sponsor",
        component: () => import("@/views/file-center/sponsor/index.vue"),
        name: "FileCenterSponsor",
        meta: {
          title: "贊助廠商",
          icon: "menu",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "agenda",
        component: () => import("@/views/file-center/agenda/index.vue"),
        name: "FileCenterAgendal",
        meta: {
          title: "Agenda",
          icon: "menu",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "download-center",
        component: () => import("@/views/file-center/download-center/index.vue"),
        name: "FileCenterDownloadCenter",
        meta: {
          title: "下載中心",
          icon: "menu",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
]

export const reviewerDynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/abstract",
    component: Layout,
    name: "abstract",

    meta: {
      title: "稿件審核",
      icon: "el-icon-Avatar",
      keepAlive: true,
      alwaysShow: false,
    },
    children: [
      {
        path: "/abstract-review",
        component: () => import("@/views/abstract-review/index.vue"),
        name: "abstractReview",
        meta: {
          title: "摘要審稿",
          icon: "el-icon-Avatar",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ]
  },
]






/**
 * 创建路由
 */
const router = createRouter({
  //此框架預設使用Hash模式
  //history: createWebHashHistory(),import.meta.env.BASE_URL

  //改用歷史模式,但要套入當前的baseURL,且Nginx要記得做設定
  history: createWebHistory(import.meta.env.BASE_URL),
  //剛剛的路由
  routes: constantRoutes,
  //移除多餘的斜線,保持乾淨
  strict: true,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});


/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export function resetReviewerRouter() {
  router.replace({ path: "/reviewer-login" })
};

export default router;
