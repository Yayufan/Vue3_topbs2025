import request from "@/utils/request";
import { AxiosPromise } from "axios";

export function getPaperPageApi(
  page: number,
  size: number,
  queryText?: string,
  status?: number,
  absType?: string,
  absProp?: string
) {
  return request({
    url: "/paper/pagination",
    method: "get",
    params: {
      page: page,
      size: size,
      queryText: queryText,
      status: status,
      absType: absType,
      absProp: absProp,
    },
  });
}

export function updatePaperApi(data: any) {
  return request({
    url: "/paper",
    method: "put",
    data,
  });
}

export async function downloadAllAbstractFileApi() {
  return request({
    url: "/paper/get-download-folder-url",
    method: "post",
  }).then((res) => {
    let url = `${import.meta.env.VITE_APP_BASE_API}${res.data}`;
    window.open(url, "_blank");
  });
}

export function assignPaperReviewersApi(data: any): AxiosPromise<any> {
  return request({
    url: "/paper/assign-paper-reviewer",
    method: "put",
    data,
  });
}

export function autoAssignPaperReviewersApi(data: any): AxiosPromise<any> {
  return request({
    url: "/paper/assign-paper-reviewer-auto",
    method: "put",
    data,
  });
}

export function downloadPaperScoreExcelApi(reviewStage: string): AxiosPromise<any> {
  return request({
    url: "/paper/download/score-excel",
    method: "get",
    params: {
      reviewStage: reviewStage,
    },
    responseType: "arraybuffer",
  });
}

export function getDownloadPaperFileUrlApi(): AxiosPromise<any> {
  return request({
    url: "/paper/download/get-download-folder-url",
    method: "post",
  });
}
