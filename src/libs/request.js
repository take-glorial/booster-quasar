import axios from "axios";
import Router from "@/router/index";
import loading from "@/libs/loading";
// import permission from '@/libs/permission'
import { Notify } from "quasar";

import { getToken, removeToken, getUserFromToken } from "@/libs/auth";

// create an axios instance
const service = axios.create({
  baseURL: process.env.API, // api base_url
  // baseURL: 'http://localhost:8080/EasyBAMWeb',
  timeout: 60000, // request timeout,
  transformRequest: [
    (data, headers) => {
      data = {
        ...data,
        sProjectCd: process.env.projectCd
      };

      const token = getUserFromToken();
      if (token) {
        const tokenUser = JSON.parse(JSON.stringify(token));
        data._sessionUserCd = tokenUser.user_cd;
      }
      return JSON.stringify(data);
    }
  ]
});

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    // if (!permission.check(config)) {
    //   Notify.create({
    //     message: Router.app.$t('No request permission')
    //   })
    //   throw '403'
    // }
    // loading.show(config)
    // const token = getToken()
    // if (token) {
    //   config.headers.Authorization = 'Bearer ' + token // 토큰 전송
    // }
    config.loading = config.loading || "";
    loading.show(config);
    const token = getToken();
    if (token) {
      config.headers.Authorization = "Bearer " + token; // 토큰 전송
    }
    return config;
  },
  error => {
    // Do something with request error
    // console.log(error) // for debug
    loading.hide(error.config);
    Promise.reject(error);
  }
);

// respone interceptor
service.interceptors.response.use(
  response => {
    loading.hide(response.config);
    if (response.status !== 200) {
      Notify.create({
        message: response.status + "오류" // res.msg
      });
      return Promise.reject("error");
    } else {
      return response;
    }
  },
  error => {
    loading.hide(error.config);
    if (error.response && error.response.status === 401) {
      removeToken();
      if (error.config.url.indexOf("logout") === -1) {
        // Notify.create({
        //   message: Router.app.$t('loginexpired')
        // })
      }
      setTimeout(() => {
        Router.push({
          name: "login"
        });
      }, 1000);
    } else if (error.response && error.response.status === 500) {
      // Notify.create({
      //   message: Router.app.$t('System error') + '!'
      // })
    } else if (error.message.indexOf("timeout") > -1) {
      // Notify.create({
      //   message: Router.app.$t('Network timeout') + '!'
      // })
    } else if (error === "403") {
    } else {
      Notify.create({
        message: Router.app.$t("Network error") + "!"
      });
    }
    return Promise.reject(error);
  }
);

export default service;
