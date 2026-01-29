import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 獲取表單內所有欄位
 * @param id
 * @returns
 */
export function getFormFieldApi(id: string): AxiosPromise {
  return request({
    url: `/form-field/${id}`,
    method: "get",
  });
}


/**
 * 新增表單欄位
 * @param data
 * @returns
 */
export function addFormFieldApi(data: any): AxiosPromise {
  return request({
    url: "/form-field",
    method: "post",
    data,
  });
}

/**
 * 複製表單欄位
 * @param data 
 * @returns 
 */
export function copyFormFieldApi(data: any): AxiosPromise {
  return request({
    url: "/form-field/copy",
    method: "post",
    data,
  });
}

/**
 * 更新表單欄位
 * @param data
 * @returns
 */
export function updateFormFieldApi(data: any): AxiosPromise {
  return request({
    url: "/form-field",
    method: "put",
    data,
  });
}

export function batchUpdateFieldOrderApi(data: any): AxiosPromise {
  return request({
    url: "/form-field/batch-order",
    method: "put",
    data,
  });
}

/**
 * 刪除單一表單欄位
 * @param id
 * @returns
 */
export function deleteFormFieldApi(id: string): AxiosPromise {
  return request({
    url: `/form-field/${id}`,
    method: "delete",
  });
}
