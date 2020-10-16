import * as authService from "@/libs/auth";
import * as loginService from "@/service/login";
import { resetRouter, makeRouter } from "@/router";

const user = {
  state: {
    token: authService.getToken(),
    userInfo: {
      agree_dt: null,
      agree_yn: null,
      dept_cd: null,
      dept_nm: null,
      desc_txt: null,
      init_yn: null,
      login_fail_cnt: null,
      login_ip: null,
      lunar_cd: null,
      project_cd: null,
      project_cnt: null,
      pw_change_cnt: null,
      pw_change_dt: null,
      reg_dt: null,
      use_yn: null,
      user_birthday: null,
      user_cd: null,
      user_email: null,
      user_eng_nm: null,
      user_fax: null,
      user_grade: null,
      user_id: null,
      user_mobile: null,
      user_nm: null,
      user_position: null,
      user_status: null,
      user_tel: null
    },
    menuInfo: []
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
    },
    SET_USERINFO(state, userInfo) {
      console.log("set_userinfo");
      state.userInfo = userInfo;
    },
    SET_MENUINFO(state, menuInfo) {
      console.log("set_menuinfo");
      state.menuInfo = menuInfo;
    }
  },
  actions: {
    // 로그인
    LoginByUserName({ commit }, userinfo) {
      const sUserId = userinfo.sUserId.trim();
      return new Promise((resolve, reject) => {
        loginService
          .loginByUsername(sUserId, userinfo.sUserPw)
          .then(response => {
            const { message, data } = response.data;
            commit("SET_TOKEN", message);
            authService.setToken({ token: message, user: data });
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 로그아웃
    Logout({ commit }, state, dispatch) {
      return new Promise((resolve, reject) => {
        loginService
          .logout()
          .then(res => {
            commit("SET_TOKEN", null);
            commit("SET_USERINFO", null);
            authService.removeToken();
            //resetRouter()
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    },
    // 사용자정보 조회
    GetUserInfo({ commit }, state) {
      return new Promise((resolve, reject) => {
        loginService
          .getUserInfo()
          .then(response => {
            const { data } = response.data;
            commit("SET_USERINFO", data.userInfo);

            //변환없이 저장
            //commit("SET_MENUINFO", data.menuInfo);
            const menuInfos = makeMenuInfo(data.menuInfo);
            commit("SET_MENUINFO", menuInfos[0].children);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};

function makeMenuInfo(menuInfos) {
  const fmRouters = [{ id: "root", children: [] }];

  menuInfos.forEach(menuInfo => {
    let {
      menu_cd,
      menu_nm,
      parent_menu,
      menu_type,
      menu_url,
      program_prefix,
      menu_level,
      menu_order,
      mymenu_yn
    } = menuInfo;
    parent_menu = parent_menu || "0";

    const fmRouter = {
      menu_cd,
      menu_nm,
      parent_menu,
      menu_type,
      menu_url,
      program_prefix,
      menu_level,
      menu_order,
      mymenu_yn,
      children: []
    };

    var level = Number.parseInt(menu_level) + 1;
    fmRouters[level - 1].children.push(fmRouter);
    fmRouters[level] = fmRouter;
  });

  return fmRouters;
}

export default user;
