import request from "@/utils/request";

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
  console.log("updatePaperApi", data);
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
