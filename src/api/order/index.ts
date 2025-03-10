import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 獲取單一訂單
 * @param id
 * @returns
 */
export function getOrdersApi(id: number): AxiosPromise {
  return request({
    url: `/orders/${id}`,
    method: "get",
  });
}

/**
 * 獲取全部訂單
 * @returns
 */
export function getAllOrdersApi(): AxiosPromise {
  return request({
    url: "/orders",
    method: "get",
  });
}





/**
 * 獲取訂單總數
 *
 * @returns
 */
export function getOrdersCountApi(): AxiosPromise {
  return request({
    url: "/orders/count",
    method: "get",
  });
}

/**
 * 根據繳費狀態,獲取相符訂單的總數
 *
 * @param status
 * @returns
 */
export function getOrdersCountByOrderStatusApi(status: string): AxiosPromise {
  return request({
    url: "/orders/count-by-order-status",
    method: "get",
    params: {
      status,
    },
  });
}

/**
 * 根據繳費狀態,獲取相符訂單的列表
 *
 * @param page - 當前頁碼
 * @param size - 每頁大小
 * @param status - 訂單狀態（可選參數）
 * @returns
 */
export function getOrdersOrder(page: number, size: number, status?: string, queryText?: string): AxiosPromise {
  return request({
    url: "/orders/orders-and-order",
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
 * 新增訂單
 * @param data
 * @returns
 */
export function addOrdersApi(data: any): AxiosPromise {
  return request({
    url: "/orders",
    method: "post",
    data,
  });
}

/**
 * 更新訂單
 * @param data
 * @returns
 */
export function updateOrdersApi(data: any): AxiosPromise {
  return request({
    url: "/orders",
    method: "put",
    data,
  });
}

/**
 * 批量更新訂單
 * @param data
 * @returns
 */
export function batchUpdateOrdersApi(data: any): AxiosPromise {
  return request({
    url: "/orders/batch",
    method: "put",
    data,
  });
}

/**
 * 刪除單一訂單
 * @param id
 * @returns
 */
export function deleteOrdersApi(id: number): AxiosPromise {
  return request({
    url: `/orders/${id}`,
    method: "delete",
  });
}

/**
 * 批量刪除訂單
 * @param id
 * @returns
 */
export function batchDeleteOrdersApi(data: any): AxiosPromise {
  return request({
    url: `/orders`,
    method: "delete",
    data,
  });
}

/**
 * 下載訂單Excel資料
 * @returns
 */
export function downloadOrdersExcelApi(): AxiosPromise {
  return request({
    url: "/orders/download-excel",
    method: "get",
    responseType: "arraybuffer",
  });
}
