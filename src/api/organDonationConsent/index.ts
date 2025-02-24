import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 獲取單一器捐同意書
 * @param id 
 * @returns 
 */
export function getOrganDonationConsentApi(id: number): AxiosPromise {
  return request({
    url: `/organ-donation-consent/${id}`,
    method: "get",
  });
}

/**
 * 獲取全部器捐同意書
 * @returns 
 */
export function getAllOrganDonationConsentApi(): AxiosPromise {
  return request({
    url: "/organ-donation-consent",
    method: "get",
  });
}


/**
 * 獲取器捐同意書(分頁)
 * @param page 
 * @param size 
 * @returns 
 */
export function getOrganDonationConsentByPaginationApi(page: number, size: number): AxiosPromise {
  return request({
    url: "/organ-donation-consent/pagination",
    method: "get",
    params: {
      page,
      size
    }
  });
}

/**
 * 根據狀態，以及搜尋條件，獲取符合的器捐同意書(分頁)
 * @param page 
 * @param size 
 * @param status
 * @param queryText (可以不填)
 * @returns 
 */
export function getOrganDonationConsentByPaginationByStatusApi(page: number, size: number, status: string, queryText?: string): AxiosPromise {
  return request({
    url: "/organ-donation-consent/pagination-by-status",
    method: "get",
    params: {
      page,
      size,
      status,
      queryText
    }
  });
}

/**
 * 獲取器捐同意書總數
 * 
 * @returns 
 */
export function getOrganDonationConsentCountApi(): AxiosPromise {
  return request({
    url: "/organ-donation-consent/count",
    method: "get",
  });
}

/**
 * 根據審核狀態,獲取相符器捐同意書的總數
 * 
 * @param status 
 * @returns 
 */
export function getOrganDonationConsentCountByStatusApi(status: string): AxiosPromise {
  return request({
    url: "/organ-donation-consent/count-by-status",
    method: "get",
    params: {
      status
    }
  });
}


/**
 * 新增器捐同意書
 * @param data 
 * @returns 
 */
export function addOrganDonationConsentApi(data: any): AxiosPromise {
  return request({
    url: "/organ-donation-consent",
    method: "post",
    data
  });
}

/**
 * 更新器捐同意書
 * @param data 
 * @returns 
 */
export function updateOrganDonationConsentApi(data: any): AxiosPromise {
  return request({
    url: "/organ-donation-consent",
    method: "put",
    data
  });
}

/**
 * 批量更新器捐同意書
 * @param data 
 * @returns 
 */
export function batchUpdateOrganDonationConsentApi(data: any): AxiosPromise {
  return request({
    url: "/organ-donation-consent/batch",
    method: "put",
    data
  });
}


/**
 * 刪除單一會員
 * @param id 
 * @returns 
 */
export function deleteOrganDonationConsentApi(id: number): AxiosPromise {
  return request({
    url: `/organ-donation-consent/${id}`,
    method: "delete",
  });
}

/**
 * 批量刪除同意書
 * @param data 
 * @returns 
 */
export function batchDeleteOrganDonationConsentApi(data: any): AxiosPromise {
  return request({
    url: `/organ-donation-consent`,
    method: "delete",
    data
  });
}


/**
 * 下載同意書Excel,這邊要注意,
 * 這邊指定了responseType為 arraybuffer,所以他在封裝的request中會判斷他是一個二進制檔案
 * @param data 
 * @returns 
 */
export function downloadExcelOrganDonationConsentApi(): AxiosPromise {
  return request({
    url: `/organ-donation-consent/download-excel`,
    method: "get",
    responseType: 'arraybuffer'
  });
}







