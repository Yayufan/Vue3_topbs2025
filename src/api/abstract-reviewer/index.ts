import request from "@/utils/request";
import { AxiosPromise } from "axios";

export function getPaperReviewerPageApi(page: number, size: number) {
  return request({
    url: "paperReviewer/pagination",
    method: "get",
    params: {
      page: page,
      size: size,
    },
  });
}

export function addPaperReviewerApi(data: any) {
  return request({
    url: "/paperReviewer",
    method: "post",
    data,
  });
}

export function editPaperReviewerApi(data: any) {
  return request({
    url: "/paperReviewer",
    method: "put",
    data,
  });
}

export function deletePaperReviewerApi(id: number) {
  return request({
    url: `/paperReviewer/${id}`,
    method: "delete",
  });
}

export function batchDeletePaperReviewerApi(ids: any) {
  return request({
    url: "/paperReviewer",
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
    url: `/paperReviewer/review/pagination`,
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
    url: `/paperReviewer/review`,
    method: "put",
    data
  });
}

export function getReviewerScoreStatusPageApi(page: number, size: number, reviewStage: string | null): AxiosPromise<any> {
  return request({
    url: `/paperReviewer/score/pagination`,
    method: "get",
    params: {
      page: page,
      size: size,
      reviewStage: reviewStage,
    }
  });

}
