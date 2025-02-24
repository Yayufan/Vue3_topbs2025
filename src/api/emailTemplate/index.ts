import request from "@/utils/request";
import { AxiosPromise } from "axios";

/**
 * 獲取單一信件模板
 * @param id
 * @returns
 */
export function getEmailTemplateApi(id: number): AxiosPromise {
  return request({
    url: `/email-template/${id}`,
    method: "get",
  });
}

/**
 * 獲取全部信件模板
 * @returns
 */
export function getAllEmailTemplateApi(): AxiosPromise {
  return request({
    url: "/email-template",
    method: "get",
  });
}

/**
 * 獲取信件模板(分頁)
 * @param page
 * @param size
 * @returns
 */
export function getEmailTemplateByPaginationApi(
  page: number,
  size: number
): AxiosPromise {
  return request({
    url: "/email-template/pagination",
    method: "get",
    params: {
      page,
      size,
    },
  });
}

/**
 * 新增信件模板
 * @param data
 * @returns
 */
export function addEmailTemplateApi(data: any): AxiosPromise {
  return request({
    url: "/email-template",
    method: "post",
    data,
  });
}

/**
 * 更新信件模板
 * @param data
 * @returns
 */
export function updateEmailTemplateApi(data: any): AxiosPromise {
  return request({
    url: "/email-template",
    method: "put",
    data,
  });
}

/**
 * 刪除單一信件模板
 * @param id
 * @returns
 */
export function deleteEmailTemplateApi(id: number): AxiosPromise {
  return request({
    url: `/email-template/${id}`,
    method: "delete",
  });
}

/**
 * 批量刪除信件模板
 * @param id
 * @returns
 */
export function batchDeleteEmailTemplateApi(data: any): AxiosPromise {
  return request({
    url: `/email-template`,
    method: "delete",
    data,
  });
}

export function sendEmailApi(data: any): AxiosPromise {
  return request({
    url: `/email-template/send-email-to-all`,
    method: "post",
    data,
  });
}
