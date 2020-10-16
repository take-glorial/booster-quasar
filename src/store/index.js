import Vue from "vue";
import Vuex from "vuex";

import getters from "./getters";

Vue.use(Vuex);

// https://webpack.js.org/guides/dependency-management/#requirecontext
const moduleFiles = require.context("./modules", true, /\.js$/);

const modules = moduleFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  modules[moduleName] = { ...moduleFiles(modulePath).default };
  return modules;
}, {});

const getDefaultState = () => {};

const store = new Vuex.Store({
  namespaced: true,
  state: () => {
    return getDefaultState();
  },
  mutations: {},
  actions: {},
  modules,
  getters
});

export default store;
