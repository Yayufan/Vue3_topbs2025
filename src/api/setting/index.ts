import request from "@/utils/request";
import { AxiosPromise } from "axios";


export function getAllSettingApi(): AxiosPromise {
  return request({
    url: "/setting",
    method: "get"
  })
}

/**
 * 更新系統設定，主要是設定是否同步
 * @param data 
 * @returns 
 */
export function updateSettingApi(data: any): AxiosPromise {
  return request({
    url: "/setting",
    method: "put",
    data
  });
}