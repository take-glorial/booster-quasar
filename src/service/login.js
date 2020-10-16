import request from "@/libs/request";
// import qs from 'qs'

export function loginByUsername(sUserId, sUserPw) {
  const data = {
    sUserId,
    sUserPw
  };

  return request({
    url: "/login/login.do",
    method: "post",
    // data: qs.stringify(data)
    data
  });
}

export function logout() {
  return request({
    url: "/login/logout.do",
    method: "post"
  });
}

export function getUserInfo() {
  return request({
    url: "/login/getUserInfo.do",
    method: "post"
  });
}
