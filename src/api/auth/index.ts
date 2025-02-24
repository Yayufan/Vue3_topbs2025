import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { CaptchaResult, LoginData, LoginResult } from "./types";

/**
 * 登录API
 *
 * @param data {LoginData}
 * @returns
 */
export function loginApi(loginData: any): AxiosPromise<LoginResult> {
  return request({
    url: "/system/sys-user/login",
    method: "post",
    data: loginData,
  });
}

/**
 * 注销API
 */
export function logoutApi() {
  return request({
    url: "/system/sys-user/logout",
    method: "post",
  });
}

/**
 * 获取驗證碼
 */
export function getCaptchaApi(): AxiosPromise<CaptchaResult> {
  return request({
    url: "/api/v1/auth/captcha",
    method: "get",
  });
}
