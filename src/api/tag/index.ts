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
  size: number,
  tagType?: string
): AxiosPromise {
  console.log("getTagsByPaginationApi", page, size, tagType);
  return request({
    url: "/tag/getTagsByPaginationApi",
    method: "get",
    params: {
      page,
      size,
      tagType,
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

export function assignPaperToTagApi(data: any) {
  console.log("assignPaperToTagApi", data);
  return request({
    url: "/tag/paper",
    method: "put",
    data,
  });
}

export function assignPaperReviewerToTagApi(data: any) {
  return request({
    url: "/tag/paper-reviewer",
    method: "put",
    data,
  });
}
