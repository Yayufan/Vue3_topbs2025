import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 獲取單一文章
 * @param id 
 * @returns 
 */
export function getArticleApi(id: number): AxiosPromise {
  return request({
    url: `/article/group/${id}`,
    method: "get",
  });
}

/**
 * 獲取文章(分頁)
 * @param page 
 * @param size 
 * @returns 
 */
export function getArticleByPaginationApi(page: number, size: number): AxiosPromise {
  return request({
    url: "/article/pagination",
    method: "get",
    params: {
      page,
      size
    }
  });
}


/**
 * 獲取全部文章
 * @returns 
 */
export function getAllArticleApi(): AxiosPromise {
  return request({
    url: "/article",
    method: "get",
  });
}


/**
 * 獲取文章總數
 * @returns 
 */
export function getArticleCountApi(): AxiosPromise {
  return request({
    url: "/article/count",
    method: "get",
  });
}

/**
 * 獲取某個組別的文章
 * 
 * @param group 
 * @returns 
 */
export function getAllArticleByGroupApi(group: string): AxiosPromise {
  return request({
    url: `/article/${group}`,
    method: "get",
  });
}

/**
 * 獲取某個組別的文章(分頁)
 * 
 * @param group 
 * @returns 
 */
export function getAllArticleByGroupByPaginationApi(group: string, page: number, size: number): AxiosPromise {
  return request({
    url: `/article/${group}/pagination`,
    method: "get",
    params: {
      page,
      size
    }
  });
}


/**
 * 獲取某個組別文章的總數
 * 
 * @param group 
 * @returns 
 */
export function getArticleCountByGroupApi(group: string): AxiosPromise {
  return request({
    url: `/article/${group}/count`,
    method: "get",
  });
}

/**
 * 獲取所有文章的瀏覽量總數
 * @returns 
 */
export function getArticleViewsCountApi(): AxiosPromise {
  return request({
    url: `/article/views-count`,
    method: "get",
  });
}


/**
 * 獲取某組別所有文章瀏覽數
 * @returns 
 */
export function getArticleViewsCountByGroupApi(group: string): AxiosPromise {
  return request({
    url: `/article/${group}/views-count`,
    method: "get",
  });
}


/**
 * 新增文章
 * @param data 
 * @returns 
 */
export function addArticleApi(data: any): AxiosPromise {
  return request({
    url: "/article",
    method: "post",
    data,
    // headers: {
    //   "Content-Type": "multipart/form-data"
    // }
  });
}

/**
 * 更新文章
 * @param data 
 * @returns 
 */
export function updateArticleApi(data: any): AxiosPromise {
  return request({
    url: "/article",
    method: "put",
    data
  });
}

/**
 * 刪除單一文章
 * @param id 
 * @returns 
 */
export function deleteArticleApi(id: number): AxiosPromise {
  return request({
    url: `/article/${id}`,
    method: "delete",
  });
}

/**
 * 批量刪除文章
 * @param id 
 * @returns 
 */
export function batchDeleteArticleApi(data: any): AxiosPromise {
  return request({
    url: `/article`,
    method: "delete",
    data
  });
}


