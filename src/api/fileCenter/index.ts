import request from "@/utils/request";
import { AxiosPromise } from "axios";


/**
 * 獲取檔案(分頁)
 * @param page 
 * @param size 
 * @returns 
 */
export function getFileByPaginationApi(page: number, size: number): AxiosPromise {
  return request({
    url: "/file/pagination",
    method: "get",
    params: {
      page,
      size
    }
  });
}


/**
 * 獲取全部檔案
 * @returns 
 */
export function getAllFileApi(): AxiosPromise {
  return request({
    url: "/file",
    method: "get",
  });
}


/**
 * 獲取某個組別的檔案
 * 
 * @param group 
 * @returns 
 */
export function getAllFileByGroupApi(group: string): AxiosPromise {
  return request({
    url: `/file/${group}`,
    method: "get",
  });
}

/**
 * 獲取某個組別的檔案(分頁)
 * 
 * @param group 
 * @returns 
 */
export function getAllFileByGroupByPaginationApi(group: string, page: number, size: number): AxiosPromise {
  return request({
    url: `/file/${group}/pagination`,
    method: "get",
    params: {
      page,
      size
    }
  });
}

/**
 * 新增檔案
 * @param data 
 * @returns 
 */
export function addFileApi(data: any): AxiosPromise {
  return request({
    url: "/file",
    method: "post",
    data,
    // headers: {
    //   "Content-Type": "multipart/form-data"
    // }
  });
}

/**
 * 更新檔案
 * @param data 
 * @returns 
 */
export function updateFileApi(data: any): AxiosPromise {
  return request({
    url: "/file",
    method: "put",
    data
  });
}

/**
 * 刪除單一檔案
 * @param id 
 * @returns 
 */
export function deleteFileApi(id: number): AxiosPromise {
  return request({
    url: `/file/${id}`,
    method: "delete",
  });
}

/**
 * 批量刪除檔案
 * @param id 
 * @returns 
 */
export function batchDeleteFileApi(data: any): AxiosPromise {
  return request({
    url: `/file`,
    method: "delete",
    data
  });
}


