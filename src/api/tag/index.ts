import request from "@/utils/request";
import { AxiosPromise } from "axios";

export function getAllTagsApi(): AxiosPromise {
  return request({
    url: "/tag",
    method: "get",
  });
}

export function getTagsByPaginationApi(
  page: number,
  size: number
): AxiosPromise {
  return request({
    url: "/tag/pagination",
    method: "get",
    params: {
      page,
      size,
    },
  });
}

export function addTagApi(tag: { name: string }): AxiosPromise {
  return request({
    url: "/tag",
    method: "post",
    data: tag,
  });
}

export function updateTagApi(data: any): AxiosPromise {
  return request({
    url: "/tag",
    method: "put",
    data: data,
  });
}

export function deleteTagApi(id: number): AxiosPromise {
  return request({
    url: `/tag/${id}`,
    method: "delete",
  });
}

export function assignMemberToTagApi(data: any): AxiosPromise {
  return request({
    url: "/tag/member",
    method: "put",
    data: data,
  });
}
