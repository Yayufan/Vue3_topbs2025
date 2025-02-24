import request from "@/utils/request";
import { AxiosPromise } from "axios";



/**
 * 獲取該文章全部附件
 * @returns 
 */
export function getAllArticleAttachmentApi(articleId: number): AxiosPromise {
  return request({
    url: `/article-attachment/${articleId}`,
    method: "get",
  });
}


/**
 * 新增文章附件
 * @param data 
 * @returns 
 */
export function addArticleAttachmentApi(data: any): AxiosPromise {
  return request({
    url: "/article-attachment",
    method: "post",
    data,
    // headers: {
    //   "Content-Type": "multipart/form-data"
    // }
  });
}

/**
 * 刪除該文章單一附件
 * @param id 
 * @returns 
 */
export function deleteArticleAttachmentApi(id: number): AxiosPromise {
  return request({
    url: `/article-attachment/${id}`,
    method: "delete",
  });
}



