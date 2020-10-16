import request from "@/libs/request";

export function getBoardList(data) {
  return request({
    url: "/main/getBoardList.do",
    method: "post",
    data
  });
}

export function myMenuInsert(data) {
  return request({
    url: "/main/myMenuInsert.do",
    method: "post",
    data
  });
}

export function myMenuDelete(data) {
  return request({
    url: "/main/myMenuDelete.do",
    method: "post",
    data
  });
}
