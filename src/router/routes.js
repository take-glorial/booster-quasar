import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

import Layout from "@/layouts/main.vue";

export const staticRouter = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login"),
    hidden: true
  },
  {
    path: "*",
    name: "403",
    component: () => import("@/pages/403")
  }
];

export const menuRouter = [
  {
    path: "/",
    name: "menuRouter",
    component: Layout,
    children: [
      {
        path: "main",
        name: "main",
        component: () => import("@/pages/index")
      }
    ]
  }
];

export const routes = [...staticRouter, ...menuRouter];
