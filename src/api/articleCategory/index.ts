

import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 獲取單一手術衛教類別
 * @param id 
 * @returns 
 */
export function getArticleCategoryApi(id: number | string): AxiosPromise {
  return request({
    url: `/article-category/${id}`,
    method: "get",
  });
}


/**
 * 獲取全部手術衛教類別
 * @returns 
 */
export function getAllArticleCategoryApi(): AxiosPromise {
  return request({
    url: "/article-category",
    method: "get",
  });
}


export function getAllArticleCategoryByGroupApi(group: string): AxiosPromise {
  return request({
    url: `/article-category/${group}`,
    method: "get",
  });
}


/**
 * 獲取手術衛教類別(分頁)
 * @param page 
 * @param size 
 * @returns 
 */
export function getArticleCategoryByPaginationApi(page: number, size: number): AxiosPromise {
  return request({
    url: "/article-category/pagination",
    method: "get",
    params: {
      page,
      size
    }
  });
}

/**
 * 新增/更新手術衛教類別
 * @param data 
 * @returns 
 */
export function saveArticleCategoryApi(data: any): AxiosPromise {
  return request({
    url: "/article-category",
    method: "post",
    data,
    // headers: {
    //   "Content-Type": "multipart/form-data"
    // }
  });
}

/**
 * 更新手術衛教類別
 * @param data 
 * @returns 
 */
export function updateArticleCategoryApi(data: any): AxiosPromise {
  return request({
    url: "/article-category",
    method: "put",
    data
  });
}

/**
 * 刪除單一手術衛教類別
 * @param id 
 * @returns 
 */
export function deleteArticleCategoryApi(id: number | string): AxiosPromise {
  return request({
    url: `/article-category/${id}`,
    method: "delete",
  });
}

/**
 * 批量刪除手術衛教類別
 * @param id 
 * @returns 
 */
export function batchDeleteArticleCategoryApi(data: any): AxiosPromise {
  return request({
    url: `/article-category`,
    method: "delete",
    data
  });
}


