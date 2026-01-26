import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 獲取單一表單
 * @param id
 * @returns
 */
export function getFormApi(id: string): AxiosPromise {
  return request({
    url: `/form/${id}`,
    method: "get",
  });
}

/**
 * 根據狀態，獲取符合的表單(分頁)
 * @param page 
 * @param size 
 * @param formStatus 
 * @param queryText 
 * @returns 
 */
export function fetchFormPageByQueryApi(
  page: number,
  size: number,
  formStatus?: string,
  queryText?: string
): AxiosPromise {
  return request({
    url: "/form/pagination",
    method: "get",
    params: {
      page,
      size,
      queryText,
      formStatus,
    },
  });
}


/**
 * 新增表單
 * @param data
 * @returns
 */
export function addFormApi(data: any): AxiosPromise {
  return request({
    url: "/form",
    method: "post",
    data,
  });
}

/**
 * 更新表單
 * @param data
 * @returns
 */
export function updateFormApi(data: any): AxiosPromise {
  return request({
    url: "/form",
    method: "put",
    data,
  });
}

/**
 * 刪除單一表單
 * @param id
 * @returns
 */
export function deleteFormApi(id: string): AxiosPromise {
  return request({
    url: `/form/${id}`,
    method: "delete",
  });
}
