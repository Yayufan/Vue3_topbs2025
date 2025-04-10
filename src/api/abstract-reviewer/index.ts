import request from "@/utils/request";

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
