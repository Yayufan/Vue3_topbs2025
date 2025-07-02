import request from "@/utils/request";
import { AxiosPromise } from "axios";

export function getPaperReviewerPageApi(page: number, size: number) {
  return request({
    url: "paper-reviewer/pagination",
    method: "get",
    params: {
      page: page,
      size: size,
    },
  });
}

export function addPaperReviewerApi(data: any) {
  return request({
    url: "/paper-reviewer",
    method: "post",
    data,
  });
}

export function editPaperReviewerApi(data: any) {
  return request({
    url: "/paper-reviewer",
    method: "put",
    data,
  });
}

export function deletePaperReviewerApi(id: number) {
  return request({
    url: `/paper-reviewer/${id}`,
    method: "delete",
  });
}

export function batchDeletePaperReviewerApi(ids: any) {
  return request({
    url: "/paper-reviewer",
    method: "delete",
    data: ids,
  });
}

export function uploadPaperReviewerFileApi(data: FormData) {
  return request({
    url: "/paper-reviewer-file",
    method: "post",
    data,
  });
}

export function updatePaperReviewerFileApi(data: FormData) {
  return request({
    url: "/paper-reviewer-file",
    method: "put",
    data,
  })
}

export function deletePaperReviewerFileApi(id: any) {
  return request({
    url: `/paper-reviewer-file/${id}`,
    method: "delete",
  })
}

export function getPaperListByReviewerApi(page: number, size: number, reviewStage: string) {
  return request({
    url: `/paper-reviewer/review/pagination`,
    method: "get",
    params: {
      page: page,
      size: size,
      reviewStage: reviewStage,
    }
  });
}

export function paperReviewApi(data: any): AxiosPromise<any> {
  return request({
    url: `/paper-reviewer/review`,
    method: "put",
    data
  });
}

export function getReviewerScoreStatusPageApi(page: number, size: number, reviewStage: string | null): AxiosPromise<any> {
  return request({
    url: `/paper-reviewer/score/pagination`,
    method: "get",
    params: {
      page: page,
      size: size,
      reviewStage: reviewStage,
    }
  });

}
