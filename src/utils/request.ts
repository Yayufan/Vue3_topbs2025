import axios, { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { useUserStoreHook } from "@/store/modules/user";

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 50000,
  // headers: { "Content-Type": "application/json;charset=utf-8" },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("Authorization");
    const reviewerAccessToken = localStorage.getItem("Authorization-paper-reviewer");
    if (accessToken) {
      config.headers.Authorization = accessToken;
    } else if (reviewerAccessToken) {
      config.headers['Authorization-paper-reviewer'] = reviewerAccessToken;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data;
    if (code == "200") {
      return response.data;
    }

    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer) {
      return response;
    }

    if (code == "401") {
      console.log("token 过期,重新登录");
      if (localStorage.getItem("Authorization-paper-reviewer")) {
        localStorage.removeItem("Authorization-paper-reviewer");
        localStorage.setItem("paper-reviewer-logout", "true");
        const userStore = useUserStoreHook();
        userStore.resetReviewerToken().then(() => {
          location.reload();
        });
      }
      localStorage.removeItem("Authorization");
    }
    if (response.status == 200 && response.data instanceof Blob) {
      return response;
    }
    ElMessage.error(msg || "系统出错");
    return Promise.reject(new Error(msg || "Error"));
  },
  (error: any) => {
    if (error.response.data) {
      const { code, msg } = error.response.data;
      // token 过期,重新登录
      if (code === "A0230") {
        ElMessageBox.confirm("当前页面已失效，请重新登录", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          const userStore = useUserStoreHook();
          if (localStorage.getItem("Authorization-paper-reviewer")) {
            userStore.resetReviewerToken().then(() => {
              location.reload();
            });
          } else {
            userStore.resetToken().then(() => {
              location.reload();
            });
          }
        });
      } else {
        ElMessage.error(msg || "系统出错");
      }
    }
    return Promise.reject(error.message);
  }
);

// 导出 axios 实例
export default service;
