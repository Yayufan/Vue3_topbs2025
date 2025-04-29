import request from "@/utils/request";

export function addNewInvitedSpeakerApi(data: any) {
  return request({
    url: "/invited-speaker",
    method: "post",
    data,
  });
}

export function updateNewInvitedSpeakerApi(data: any) {
  return request({
    url: "/invited-speaker",
    method: "put",
    data,
  });
}

export function getInvitedSpeakerListByPaginationApi(
  page: number,
  size: number
) {
  return request({
    url: "/invited-speaker/pagination",
    method: "get",
    params: {
      page,
      size,
    },
  });
}

export function deleteInvitedSpeakerApi(id: number) {
  return request({
    url: `/invited-speaker/${id}`,
    method: "delete",
  });
}

export function batchDeleteInvitedSpeakerApi(ids: any[]) {
  return request({
    url: "/invited-speaker",
    method: "delete",
    data: ids,
  });
}
