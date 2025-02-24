import { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import { listRoutes } from "@/api/menu";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");

// console.log('原本路由列表', constantRoutes)

/**
 * Use meta.role to determine if the current user has permission
 *
 * @param roles 用户角色集合
 * @param route 路由
 * @returns
 */

//較驗用户(角色)是否有该路由的访问权限
const hasPermission = (roles: string[], route: RouteRecordRaw) => {
  if (route.meta && route.meta.roles) {
    // 角色【超级管理员】拥有所有权限，忽略校验
    if (roles.includes("ROOT")) {
      return true;
    }
    return roles.some((role) => {
      if (route.meta?.roles) {
        return route.meta.roles.includes(role);
      }
    });
  }
  return false;
};

/**
 * 递归过滤有权限的异步(动态)路由
 *
 * @param routes 接口返回的异步(动态)路由
 * @param roles 用户角色集合
 * @returns 返回用户有权限的异步(动态)路由
 */
const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]) => {

  //異步路由數組,原始路由也是數組
  const asyncRoutes: RouteRecordRaw[] = [];

  routes.forEach((route) => {

    // console.log('過濾路由-單個動態路由', route)

    // ES6扩展运算符复制新对象,這邊要進行重新組裝
    const tmpRoute = { ...route };

    if (!route.name) {
      tmpRoute.name = route.path;
    }
    // 判断用户(角色)是否有该路由的访问权限,有這個權限才要組裝這個動態路由
    if (hasPermission(roles, tmpRoute)) {
      if (tmpRoute.component?.toString() == "Layout") {
        console.log('暫存路由佈局', tmpRoute.component)
        tmpRoute.component = Layout;
        console.log('暫存路由佈局', tmpRoute.component)
      } else {
        //創建路由的配置組件,但有可能引入modules不匹配
        const component = modules[`../../views/${tmpRoute.component}.vue`];
        //這邊做判斷,能正確引入,就為他配置組件
        if (component) {
          tmpRoute.component = component;
          //引入失敗就使用404的頁面
        } else {
          tmpRoute.component = modules[`../../views/error-page/404.vue`];
        }
      }

      //如果他有子路由,就遞歸執行這個function
      if (tmpRoute.children) {
        tmpRoute.children = filterAsyncRoutes(tmpRoute.children, roles);
      }

      //添加到數組中,最後要一起返回
      asyncRoutes.push(tmpRoute);
    }
  });

  return asyncRoutes;
};

// setup
export const usePermissionStore = defineStore("permission", () => {
  // state, 這邊只是放在usePermissionStroe裡面,讓布局拿的到路由的結構
  const routes = ref<RouteRecordRaw[]>([]);

  // actions,用來將靜態路由和動態路由做拼接,並放到權限路由倉庫中
  function setRoutes(newRoutes: RouteRecordRaw[]) {
    routes.value = constantRoutes.concat(newRoutes);
  }
  /**
   * 生成动态路由
   *
   * @param roles 用户角色集合
   * @returns
   */
  function generateRoutes(roles: string[]) {

    //不啟用動態路由時,直接將空數組作為代替,讓他去與設定好的靜態路由去做拼接
    setRoutes([]);

    //同時也返回一個空數組,沒有效果,但是能讓/plugins/permission.ts再調用時TS編譯不報錯
    return []

    //需要啟用動態路由需要後臺配合,需要時再開啟
    /*
    return new Promise<RouteRecordRaw[]>((resolve, reject) => {
      // 接口获取所有路由,默認使用別人的線上接口
      listRoutes()
        .then(({ data: asyncRoutes }) => {

          console.log('api獲取的,動態的路由列表', asyncRoutes)
          // 根据角色获取有访问权限的路由
          const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);

          //返回更新的路由,於PermissionStore 權限倉庫儲存,用於設置layout
          setRoutes(accessedRoutes);

          resolve(accessedRoutes);
        })
        .catch((error) => {
          reject(error);
        });
    });

    */
  }
  /**
   * 获取与激活的顶部菜单项相关的混合模式左侧菜单集合
   */
  const mixLeftMenus = ref<RouteRecordRaw[]>([]);

  function setMixLeftMenus(topMenuPath: string) {
    const matchedItem = routes.value.find((item) => item.path === topMenuPath);
    if (matchedItem && matchedItem.children) {
      mixLeftMenus.value = matchedItem.children;
    }
  }
  return {
    routes,
    setRoutes,
    generateRoutes,
    mixLeftMenus,
    setMixLeftMenus,
  };
});

// 非setup
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
