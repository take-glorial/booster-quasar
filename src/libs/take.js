import request from "@/libs/request";

/*
{
  aNameSpace: "BoardManagement.boardInfoList",
  sInDs: "noticeList",
  sParam: {
    project_cd: process.env.projectCd,
    menu_cd: "M0028"
  }
}
*/
export function transelect(data) {
  return request({
    url: "select.do",
    method: "post",
    data: {
      sParams: data
    }
  });
}

/*
{
  aNameSpace: "BoardManagement.boardInfoList",
  sOutDs: "noticeList",
  sParam: {
    project_cd: process.env.projectCd,
    menu_cd: "M0028"
  }
}
*/
export function transave(data) {
  return request({
    url: "save.do",
    method: "post",
    data: {
      sParams: data
    }
  });
}
