import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 獲取可編輯表單回覆 (單一表單回覆)
 * @param id
 * @returns
 */
export function getEditableResponseApi(id: string): AxiosPromise {
  return request({
    url: `/form-response/${id}`,
    method: "get",
  });
}

/**
 * 根據表單ID，獲取符合的表單響應(分頁)
 * @param page 
 * @param size 
 * @param formId 
 * @returns 
 */
export function fetchResponsePageApi(
  page: number,
  size: number,
  formId: string
): AxiosPromise {
  return request({
    url: "/form-response/pagination",
    method: "get",
    params: {
      page,
      size,
      formId
    },
  });
}

/**
 * 更新表單回覆
 * @param data
 * @returns
 */
export function updateResponseApi(data: any): AxiosPromise {
  return request({
    url: "/form-response",
    method: "put",
    data,
  });
}

/**
 * 刪除單一表單
 * @param id
 * @returns
 */
export function deleteResponseApi(id: string): AxiosPromise {
  return request({
    url: `/form-response/${id}`,
    method: "delete",
  });
}

/**
 * 下載表單回覆Excel
 * @param id 
 * @returns 
 */
export function downloadExcelApi(id: string): AxiosPromise {
  return request({
    url: `/form-response/get-download-url`,
    method: "get",
    params: {
      formId: id,
    }
  });
}