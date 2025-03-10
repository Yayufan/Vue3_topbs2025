import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 獲取單一會員
 * @param id
 * @returns
 */
export function getMemberApi(id: number): AxiosPromise {
  return request({
    url: `/member/${id}`,
    method: "get",
  });
}

/**
 * 獲取全部會員
 * @returns
 */
export function getAllMemberApi(): AxiosPromise {
  return request({
    url: "/member",
    method: "get",
  });
}

/**
 * 獲取會員(分頁)
 * @param page
 * @param size
 * @returns
 */
export function getMemberByPaginationApi(
  page: number,
  size: number
): AxiosPromise {
  return request({
    url: "/member/tag/pagination",
    method: "get",
    params: {
      page,
      size,
    },
  });
}

/**
 * 根據狀態，獲取符合的會員(分頁)
 * @param page
 * @param size
 * @param status
 * @returns
 */
export function getMemberByPaginationByStatusApi(
  page: number,
  size: number,
  status: string,
  queryText?: string
  // tags?: number[]
): AxiosPromise {
  // console.log("tags", tags);
  return request({
    url: "/member/tag/pagination-by-query",
    method: "get",
    params: {
      page,
      size,
      queryText,
      status,
      // tags,
    },
  });
}

/**
 * 獲取會員總數
 *
 * @returns
 */
export function getMemberCountApi(): AxiosPromise {
  return request({
    url: "/member/count",
    method: "get",
  });
}

/**
 * 根據繳費狀態,獲取相符會員的總數
 *
 * @param status
 * @returns
 */
export function getMemberCountByOrderStatusApi(status: string): AxiosPromise {
  return request({
    url: "/member/count-by-order-status",
    method: "get",
    params: {
      status,
    },
  });
}

/**
 * 根據繳費狀態,獲取相符會員的列表
 *
 * @param page - 當前頁碼
 * @param size - 每頁大小
 * @param status - 訂單狀態（可選參數）
 * @returns
 */
export function getMemberOrder(page: number, size: number, status?: string, queryText?: string): AxiosPromise {
  return request({
    url: "/member/member-and-order",
    method: "get",
    params: {
      page,
      size,
      status,
      queryText
    },
  });
}

/**
 * 新增會員
 * @param data
 * @returns
 */
export function addMemberApi(data: any): AxiosPromise {
  return request({
    url: "/member",
    method: "post",
    data,
  });
}

/**
 * 更新會員
 * @param data
 * @returns
 */
export function updateMemberApi(data: any): AxiosPromise {
  return request({
    url: "/member",
    method: "put",
    data,
  });
}

/**
 * 批量更新會員
 * @param data
 * @returns
 */
export function batchUpdateMemberApi(data: any): AxiosPromise {
  return request({
    url: "/member/batch",
    method: "put",
    data,
  });
}

/**
 * 刪除單一會員
 * @param id
 * @returns
 */
export function deleteMemberApi(id: number): AxiosPromise {
  return request({
    url: `/member/${id}`,
    method: "delete",
  });
}

/**
 * 批量刪除會員
 * @param id
 * @returns
 */
export function batchDeleteMemberApi(data: any): AxiosPromise {
  return request({
    url: `/member`,
    method: "delete",
    data,
  });
}

/**
 * 下載會員Excel資料
 * @returns
 */
export function downloadMemberExcelApi(): AxiosPromise {
  return request({
    url: "/member/download-excel",
    method: "get",
    responseType: "arraybuffer",
  });
}

export function assignTagsToMember(data: any): AxiosPromise {
  return request({
    url: "/member/tag",
    method: "put",
    data,
  });
}
