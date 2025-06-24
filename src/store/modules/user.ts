import { loginApi, logoutApi, reviewerLoginApi, reviewerLogoutApi } from "@/api/auth";
import { getReviewerInfoApi, getUserInfoApi } from "@/api/user";
import { resetReviewerRouter, resetRouter } from "@/router";
import { store } from "@/store";

import { LoginData } from "@/api/auth/types";
import { UserInfo } from "@/api/user/types";
import { AxiosPromise } from "axios";

export const useUserStore = defineStore("user", () => {
  const user = reactive<Record<string, any>>({
  });

  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: any) {
    return new Promise<void>((resolve, reject) => {
      loginApi(loginData)
        .then((response) => {
          const { tokenName, tokenValue } = response.data as { tokenName: string; tokenValue: string };;
          // console.log(tokenName, tokenValue)
          localStorage.setItem(tokenName, "Bearer" + " " + tokenValue)
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function reviewerLogin(loginData: any) {
    return new Promise<void>((resolve, reject) => {
      reviewerLoginApi(loginData)
        .then((response) => {
          const { tokenName, tokenValue } = response.data as { tokenName: string; tokenValue: string };;
          console.log(tokenName, tokenValue)
          localStorage.setItem(tokenName, "Bearer" + " " + tokenValue)
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }



  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    return new Promise((resolve, reject) => {
      getUserInfoApi()
        .then((res) => {
          // console.log(res)
          Object.assign(user, res.data);
          user.roleList = ["ROOT"];
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function getReviewerInfo() {
    return new Promise((resolve, reject) => {
      getReviewerInfoApi()
        .then((res: any) => {
          // console.log(res)
          Object.assign(user, res.data);
          user.roleList = ["paperReviewer"];
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      logoutApi()
        .then(() => {
          localStorage.removeItem("Authorization");
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
  function reviewerLogout() {
    return new Promise<void>((resolve, reject) => {
      reviewerLogoutApi()
        .then(() => {
          localStorage.removeItem("Authorization");
          localStorage.removeItem("Authorization-paper-reviewer");
          localStorage.setItem("paper-reviewer-logout", "true");
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // remove token
  function resetToken() {
    console.log("resetToken");
    return new Promise<void>((resolve) => {
      localStorage.setItem("Authorization", "");
      resetRouter();
      resolve();
    });
  }

  function resetReviewerToken() {
    console.log("resetReviewerToken");
    return new Promise<void>((resolve) => {
      localStorage.setItem("Authorization-paper-reviewer", "");
      resetReviewerRouter();
      resolve();
    });
  }

  return {
    user,
    login,
    getUserInfo,
    getReviewerInfo,
    logout,
    reviewerLogout,
    resetToken,
    resetReviewerToken,
    reviewerLogin,
  };
});

// 非setup
export function useUserStoreHook() {
  return useUserStore(store);
}
