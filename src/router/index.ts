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

  // {
  //   path: "/setting",
  //   component: Layout,
  //   name: "Setting", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
  //   // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
  //   meta: {
  //     title: "設定頁面",
  //     icon: "el-icon-Setting",
  //     //affix: true,
  //     keepAlive: true,
  //     alwaysShow: false,
  //   },
  //   children: [
  //     {
  //       path: "",
  //       component: () => import("@/views/setting/index.vue"),
  //       name: "SettingPage",
  //       meta: {
  //         title: "系統設定",
  //         icon: "el-icon-Setting",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,

  //       }
  //     }
  //   ]
  // },

  //小腸協會,會員的審核及列表
  {
    path: "/member",
    component: Layout,
    name: "member", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
    // https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
    meta: {
      title: "會員管理",
      icon: "el-icon-Avatar",
      //affix: true,
      keepAlive: true,
      alwaysShow: false,
    },
    children: [
      {
        path: "",
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
          title: "會員審核",
          icon: "el-icon-Finished",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },

  //小腸協會,信件的模板及寄信
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
    },
    children: [
      {
        path: "",
        component: () => import("@/views/tags/index.vue"),
        name: "tags-manage",
        meta: {
          title: "標籤管理",
          icon: "el-icon-PriceTag",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },

  //器捐協會沒有類別管理
  // {
  //   path: "/category",
  //   component: Layout,
  //   redirect: "/category/professional-medical",
  //   name: "Category",
  //   meta: {
  //     title: "類別管理",
  //     icon: "system",
  //     hidden: false,
  //     roles: ["ADMIN"],
  //   },
  //   children: [
  //     /**專業醫療類別路由 */
  //     {
  //       path: "professional-medical",
  //       component: () => import("@/views/category/professionalMedical/index.vue"),
  //       name: "Category-ProfessionalMedical",
  //       meta: {
  //         title: "專業醫療",
  //         icon: "el-icon-DataAnalysis",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     /**衛教手術路由 */
  //     {
  //       path: "education_surgery",
  //       component: () => import("@/views/category/educationSurgery/index.vue"),
  //       name: "Category-EducationSurgery",
  //       meta: {
  //         title: "手術衛教",
  //         icon: "el-icon-List",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //   ]
  // },

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

      /**活動花絮路由,以及其編輯路由 */
      {
        path: "event-highlights",
        component: () => import("@/views/content/eventHighlights/index.vue"),
        name: "NewsContentEventHighlights",
        meta: {
          title: "活動花絮",
          icon: "menu",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "event-highlights/:id",
        component: () =>
          import("@/views/content/eventHighlights/EventHighlightsItem.vue"),
        name: "NewsContentEventHighlightsItem",
        props: true,
        meta: {
          title: "活動花絮文章編輯",
          icon: "dict",
          hidden: true,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },

    ],
  },

  // 影音專區
  {
    path: "/videoArea-content",
    component: Layout,
    redirect: "/videoArea-content/featuredVideo",
    name: "VideoAreaContent",
    meta: {
      title: "影音專區-內容管理",
      icon: "el-icon-EditPen",
      hidden: false,
      roles: ["ADMIN"],
    },
    children: [
      /**影片精選路由,以及其編輯路由 */
      {
        path: "featuredVideo",
        component: () => import("@/views/content/featuredVideo/index.vue"),
        name: "VideoAreaContentFeaturedVideo",
        meta: {
          title: "影音專區-內容管理",
          icon: "menu",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "featuredVideo/:id",
        component: () => import("@/views/content/featuredVideo/featuredVideoItem.vue"),
        name: "VideoAreaContentFeaturedVideoItem",
        props: true,
        meta: {
          title: "影片精選編輯",
          icon: "menu",
          hidden: true,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },

    ],
  },

  // 衛教資訊
  {
    path: "/health-education-info-content",
    component: Layout,
    redirect: "/health-education-info-content/case-sharing",
    name: "HealthEducationInfoContent",
    meta: {
      title: "衛教資訊-內容管理",
      icon: "el-icon-EditPen",
      hidden: false,
      roles: ["ADMIN"],
    },
    children: [
      /**案例分享路由,以及其編輯路由 */
      {
        path: "case-sharing",
        component: () => import("@/views/content/caseSharing/index.vue"),
        name: "HealthEducationInfoContentCaseSharing",
        meta: {
          title: "衛教資訊-內容管理",
          icon: "menu",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "case-sharing/:id",
        component: () => import("@/views/content/caseSharing/CaseSharingItem.vue"),
        name: "HealthEducationInfoContentCaseSharingItem",
        props: true,
        meta: {
          title: "案例分享編輯",
          icon: "menu",
          hidden: true,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      }]
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
      hidden: true,
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
          hidden: false,
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
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },

  /**測試文章 */
  // {
  //   path: "/test",
  //   component: Layout,
  //   redirect: "/test/news",
  //   name: "testContent",
  //   meta: {
  //     title: "內容管理測試",
  //     icon: "el-icon-EditPen",
  //     hidden: false,
  //     roles: ["ADMIN"],
  //   },
  //   children: [
  //     /**最新消息路由,以及其編輯路由 */
  //     {
  //       path: "news",
  //       component: () => import("@/views/test/news/index.vue"),
  //       name: "Content-Test-News",
  //       meta: {
  //         title: "最新消息",
  //         icon: "menu",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     {
  //       path: "news/:id",
  //       component: () => import("@/views/test/news/NewsItem.vue"),
  //       name: "Content-Test-NewsItem",
  //       props: true,
  //       meta: {
  //         title: "最新消息編輯",
  //         icon: "menu",
  //         hidden: true,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     /**醫學新知路由,以及其編輯路由 */
  //     {
  //       path: "medical-knowledge",
  //       component: () => import("@/views/test/medicalKnowledge/index.vue"),
  //       name: "Content-Test-MedicalKnowledge",
  //       meta: {
  //         title: "醫學新知",
  //         icon: "dict",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     {
  //       path: "medical-knowledge/:id",
  //       component: () => import("@/views/test/medicalKnowledge/MedicalKnowledgeItem.vue"),
  //       name: "Content-Test-MedicalKnowledgeItem",
  //       props: true,
  //       meta: {
  //         title: "醫學新知文章編輯",
  //         icon: "dict",
  //         hidden: true,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     /**專業醫療文章路由,以及其編輯路由 */
  //     {
  //       path: "professional-medical",
  //       component: () => import("@/views/test/professionalMedical/index.vue"),
  //       name: "Content-Test-ProfessionalMedical",
  //       meta: {
  //         title: "專業醫療",
  //         icon: "el-icon-DataAnalysis",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     {
  //       path: "professional-medical/:id",
  //       component: () => import("@/views/test/professionalMedical/ProfessionalMedicalItem.vue"),
  //       name: "Content-Test-ProfessionalMedicalItem",
  //       props: true,
  //       meta: {
  //         title: "專業醫療文章編輯",
  //         icon: "dict",
  //         hidden: true,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     /** 手術衛教文章路由，以及其編輯路由 */
  //     {
  //       path: "education-surgery",
  //       component: () => import("@/views/test/educationSurgery/index.vue"),
  //       name: "Contentt-Test-EducationSurgery",
  //       meta: {
  //         title: "手術衛教",
  //         icon: "el-icon-DataAnalysis",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     {
  //       path: "education-surgery/:id",
  //       component: () => import("@/views/test/educationSurgery/EducationSurgeryItem.vue"),
  //       name: "Content-Test-EducationSurgeryItem",
  //       props: true,
  //       meta: {
  //         title: "手術衛教文章編輯",
  //         icon: "dict",
  //         hidden: true,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //   ]
  // },
  // /**  測試目錄  */
  // {
  //   path: "/testCategory",
  //   component: Layout,
  //   redirect: "/testCategory/professional-medical",
  //   name: "testCategory",
  //   meta: {
  //     title: "類別管理測試",
  //     icon: "system",
  //     hidden: false,
  //     roles: ["ADMIN"],
  //   },
  //   children: [
  //     /**專業醫療類別路由 */
  //     {
  //       path: "professional-medical",
  //       component: () => import("@/views/testCategory/professionalMedical/index.vue"),
  //       name: "testCategory-ProfessionalMedical",
  //       meta: {
  //         title: "專業醫療",
  //         icon: "el-icon-DataAnalysis",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //     /**衛教手術路由 */
  //     {
  //       path: "education_surgery",
  //       component: () => import("@/views/testCategory/educationSurgery/index.vue"),
  //       name: "testCategory-EducationSurgery",
  //       meta: {
  //         title: "衛教手術",
  //         icon: "el-icon-List",
  //         hidden: false,
  //         roles: ["ADMIN"],
  //         keepAlive: true,
  //       },
  //     },
  //   ]
  // },

  //系統權限路由
  /**
   * 這邊要注意最少需要填寫兩個子路由他才會,變成一個嵌套的navbar選項
   *
   * path:路由路徑
   * component:一級菜單預設component都是Layout,因為一級菜單幾乎不直接顯示
   * redirect:重定向,從對應的一級路由中,挑一個預設的二級路由,來做為預設的顯示
   * name:路由別名
   * meta:元數據,預設其實沒什麼效果,但是在後台管理系統中,這些數據有各自的意義
   *        1.title:標題,
   *        2.icon:圖標,
   *        3.hidden:是否隱藏
   *        4.roles:允許進入的角色
   *        5.keepAlive:是否成為緩存路由,這邊要注意,緩存的是數據,不是在navbar上的顯示
   *
   */

  /*
 
  {
    path: "/system",
    component: Layout,
    redirect: "/system/user",
    name: "/system",
    meta: {
      title: "系统管理",
      icon: "system",
      hidden: false,
      roles: ["ADMIN"],
    },
    children: [
      {
        path: "user",
        component: () => import("@/views/system/user/index.vue"),
        name: "User",
        meta: {
          title: "用户管理",
          icon: "user",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "role",
        component: () => import("@/views/system/role/index.vue"),
        name: "Role",
        meta: {
          title: "角色管理",
          icon: "role",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "menu",
        component: () => import("@/views/system/menu/index.vue"),
        name: "Menu",
        meta: {
          title: "菜單管理",
          icon: "menu",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "dept",
        component: () => import("@/views/system/dept/index.vue"),
        name: "Dept",
        meta: {
          title: "部門管理",
          icon: "tree",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
      {
        path: "dict",
        component: () => import("@/views/system/dict/index.vue"),
        name: "Dict",
        meta: {
          title: "字典管理",
          icon: "dict",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
      },
    ],
  },
 
  //多級路由範例
  {
    path: "/multi-level",
    component: Layout,
    redirect: "/multi-level/multi-level1",
    name: "/multiLevel",
    meta: {
      title: "多級菜單",
      icon: "cascader",
      hidden: false,
      roles: ["ADMIN"],
    },
    children: [
      {
        path: "multi-level1",
        component: () => import("@/views/demo/multi-level/level1.vue"),
        redirect: "/multi-level/multi-level2",
        name: "MultiLevel1",
        meta: {
          title: "菜單一級",
          icon: "",
          hidden: false,
          roles: ["ADMIN"],
          keepAlive: true,
        },
        children: [
          {
            path: "multi-level2",
            component: () => import("@/views/demo/multi-level/children/level2.vue"),
            redirect: "/multi-level/multi-level2/multi-level3-1",
            name: "MultiLevel2",
            meta: {
              title: "菜單二級",
              icon: "",
              hidden: false,
              roles: ["ADMIN"],
              keepAlive: true,
            },
            children: [
              {
                path: "multi-level3-1",
                component: () => import("@/views/demo/multi-level/children/children/level3-1.vue"),
                name: "MultiLevel31",
                meta: {
                  title: "菜單三級-1",
                  icon: "",
                  hidden: false,
                  roles: ["ADMIN"],
                  keepAlive: true,
                },
              },
              {
                path: "multi-level3-2",
                component: () => import("@/views/demo/multi-level/children/children/level3-2.vue"),
                name: "MultiLevel32",
                meta: {
                  title: "菜單三級-2",
                  icon: "",
                  hidden: false,
                  roles: ["ADMIN"],
                  keepAlive: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
 
  // 外部链接
  // {
  //   path: "/external-link",
  //   component: Layout,
  //   children: [ {
  //       component: () => import("@/views/external-link/index.vue"),
  //       path: "https://www.cnblogs.com/haoxianrui/",
  //       meta: { title: "外部链接", icon: "link" },
  //     },
  //   ],
  // },
  // 多級嵌套路由
  /* {
         path: '/nested',
         component: Layout,
         redirect: '/nested/level1/level2',
         name: 'Nested',
         meta: {title: '多級菜單', icon: 'nested'},
         children: [
             {
                 path: 'level1',
                 component: () => import('@/views/nested/level1/index.vue'),
                 name: 'Level1',
                 meta: {title: '菜單一級'},
                 redirect: '/nested/level1/level2',
                 children: [
                     {
                         path: 'level2',
                         component: () => import('@/views/nested/level1/level2/index.vue'),
                         name: 'Level2',
                         meta: {title: '菜單二級'},
                         redirect: '/nested/level1/level2/level3',
                         children: [
                             {
                                 path: 'level3-1',
                                 component: () => import('@/views/nested/level1/level2/level3/index1.vue'),
                                 name: 'Level3-1',
                                 meta: {title: '菜單三級-1'}
                             },
                             {
                                 path: 'level3-2',
                                 component: () => import('@/views/nested/level1/level2/level3/index2.vue'),
                                 name: 'Level3-2',
                                 meta: {title: '菜單三級-2'}
                             }
                         ]
                     }
                 ]
             },
         ]
     }
     
     
     
     */
];

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

console.log(import.meta.env.BASE_URL);

/**
 * 重置路由
 */
export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
