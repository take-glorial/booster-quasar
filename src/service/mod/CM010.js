import request from "@/libs/request";

export function boardSelect(data) {
  return request({
    url: "/cm/boardSelect.do",
    method: "post",
    data
  });
}

export function boardDelete(data) {
  return request({
    url: "/cm/boardDelete.do",
    method: "post",
    data
  });
}
