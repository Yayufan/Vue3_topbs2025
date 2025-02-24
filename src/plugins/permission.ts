import router from "@/router";
import { useUserStore, usePermissionStore } from "@/store";
import NProgress from "@/utils/nprogress";
import { RouteRecordRaw } from "vue-router";

export function setupPermission() {
  // 白名单路由
  const whiteList = ["/login"];

  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const hasToken = localStorage.getItem("Authorization");

    if (hasToken) {
      if (to.path === "/login") {
        // 如果已登录，跳转首頁
        next({ path: "/" });
        NProgress.done();
      } else {
        const userStore = useUserStore();

        //查看現在userStore有沒有內容
        if (userStore.user.roleList) {
          console.log('原本的 userStore user', userStore.user)
        } else {
          try {
            await userStore.getUserInfo();
            console.log('新的userStore user', userStore.user)
          } catch (err) {
            next(`/login?redirect=${to.path}`);
            NProgress.done();
          }
        }

        //獲取菜單權限路由 
        const permissionStore = usePermissionStore();
        //每次都拿這個這個角色在去生成一次他的動態路由
        const accessRoutes = await permissionStore.generateRoutes(userStore.user.roleList);

        // console.log('在permission裡生成的動態路由', accessRoutes)
        // console.log('路由器', router)

        //遍歷動態路由,真正由路由器進行添加
        //再只使用靜態路由時,這個遍歷添加其實無效,但是也沒關係,不影響運作
        accessRoutes.forEach((route: RouteRecordRaw) => {
          router.addRoute(route);
        });

        // 未匹配到任何路由，跳转404
        if (to.matched.length === 0) {
          from.name ? next({ name: from.name }) : next("/404");
        } else {
          next();
        }

        // next()


      }
    } else {
      // 未登录可以访问白名单页面
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
    }


    // next()
    /** 

    if (hasToken) {
      if (to.path === "/login") {
        // 如果已登录，跳转首頁
        next({ path: "/" });
        NProgress.done();
      } else {
        const userStore = useUserStore();
        console.log('userStore目前有', userStore)
        const hasRoles =
          userStore.user.roles && userStore.user.roles.length > 0;
        console.log(userStore.user.roles)
        console.log(userStore.user.roles.length)
        console.log(hasRoles)

        if (hasRoles) {
          // 未匹配到任何路由，跳转404
          if (to.matched.length === 0) {
            from.name ? next({ name: from.name }) : next("/404");
          } else {
            next();
          }
        } else {
          const permissionStore = usePermissionStore();
          try {
            const { roles } = await userStore.getUserInfo();
            //當前角色
            console.log('當前角色', roles)

            //每次都拿這個這個角色在去生成一次他的動態路由
            const accessRoutes = await permissionStore.generateRoutes(roles);

            console.log('在permission裡生成的動態路由', accessRoutes)
            console.log('路由器', router)

            //遍歷動態路由,真正由路由器進行添加
            //再只使用靜態路由時,這個遍歷添加其實無效,但是也沒關係,不影響運作
            accessRoutes.forEach((route: RouteRecordRaw) => {
              router.addRoute(route);
            });


            next({ ...to, replace: true });
          } catch (error) {
            // 移除 token 并跳转登录页
            await userStore.resetToken();
            next(`/login?redirect=${to.path}`);
            NProgress.done();
          }
        }
      }
    } else {
      // 未登录可以访问白名单页面
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
    }

    */
  });

  router.afterEach(() => {
    NProgress.done();
  });
}
