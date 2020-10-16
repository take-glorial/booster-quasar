import Vue from "vue";
import VueRouter from "vue-router";
import { Notify } from "quasar";

import { staticRouter, menuRouter } from "./routes";

import { getToken } from "@/libs/auth";
import store from "@/store";
import axios from "axios";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const whiteList = ["/login", "/403"]; // whitelist

// Router 실행 전
// const router = create();
const createRouter = () =>
  new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

function makeRoutes(menuInfos) {
  const fmRouters = [{ id: "root", children: [] }];

  menuInfos.forEach(menuInfo => {
    let {
      menu_cd,
      menu_nm,
      parent_menu,
      menu_type,
      menu_url,
      program_prefix
    } = menuInfo;
    parent_menu = parent_menu || "0";

    const fmRouter = {
      path: "/" + menu_cd,
      component: () => {
        if (menu_type !== "02") {
          return import(`@/pages/${program_prefix}/${menu_url}.vue`);
        } else {
          return import(`@/layouts/main.vue`);
        }
      },
      name: menu_cd,
      children: [],
      meta: {
        title: menu_nm
      }
    };

    var level = Number.parseInt(menuInfo.menu_level) + 1;
    fmRouters[level - 1].children.push(fmRouter);
    fmRouters[level] = fmRouter;
  });

  return fmRouters;
}

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
  console.log("resetRouter::::", router);
  //router.options.routes = [];
}

export default async function() {
  return await new Promise((resolve, reject) => {
    axios
      .post(process.env.API + "/login/getMenuInfo.do", {
        sProjectCd: process.env.projectCd
      })
      .then(res => {
        const childRoutes = makeRoutes(res.data.data.menuInfo);
        const rRoute = new VueRouter({
          scrollBehavior: () => ({ x: 0, y: 0 }),
          routes: [...menuRouter, ...childRoutes[0].children, ...staticRouter],

          // Leave these as they are and change in quasar.conf.js instead!
          // quasar.conf.js -> build -> vueRouterMode
          // quasar.conf.js -> build -> publicPath
          mode: process.env.VUE_ROUTER_MODE,
          base: process.env.VUE_ROUTER_BASE
        });

        rRoute.beforeEach(async (to, from, next) => {
          if (getToken()) {
            const userInfo = store.state.user.userInfo;
            if (!userInfo || !userInfo.user_cd) {
              // 토큰은 있지만 사용자 정보가 존재하지 않을 경우 사용자 정보 재조회
              await store.dispatch("GetUserInfo");
              if (to.path === "/login" || to.path === "/") {
                // 로그인 페이지로 이동 하려 할 메인화면으로 다시 이동
                console.log("GetUserInfo 후 메인페이지로 이동");
                next({ name: "main" });
              } else {
                // 세션이 존재한다면 업무페이지로 이동
                //next({ ...to, replace: true }); //replace:true는 sendForward와 같음
                next();
              }
            } else {
              //console.log("userinfo.user_cd도 있음?", to);
              next();
            }
          } else {
            // 토큰이 없는경우
            if (whiteList.indexOf(to.path) !== -1) {
              // 로그인 페이지로 이동 하려 할 경우는 세션체크 안함
              next();
            } else {
              // 세션이 없다면 바로 로그인 페이지로 이동
              next({ name: "login" });
            }
          }
        });

        rRoute.afterEach(to => {
          window.scrollTo(0, 0);
        });

        resolve(rRoute);
      })
      .catch(err => {
        Notify.create({
          message: "Network error!"
        });
        reject(null);
      });
  });
}
