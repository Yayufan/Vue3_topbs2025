import request from "@/utils/request";
import { AxiosPromise } from "axios";

export function getAttendeeListByTagAndPaginationApi(
  page: number,
  queryText: string
): AxiosPromise {
  return request({
    url: "/attendees/tag/pagination",
    method: "get",
    params: {
      page: page,
      size: 10,
      queryText: queryText,
    },
  });
}

export function deleteAttendeeApi(id: number): AxiosPromise {
  return request({
    url: `/attendees/${id}`,
    method: "delete",
  });
}

export function batchDeleteAttendeesApi(data: any): AxiosPromise {
  return request({
    url: "/attendees",
    method: "delete",
    data,
  });
}

export function assignTagToAttendeeApi(data: any): AxiosPromise {
  return request({
    url: `/tag/attendees`,
    method: "put",
    data,
  });
}

export function downloadAttendeeExcelApi(): AxiosPromise {
  return request({
    url: "/attendees/download-excel",
    method: "get",
    responseType: "arraybuffer",
  });
}
