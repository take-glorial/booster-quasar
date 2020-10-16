import Vue from "vue";
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:8080/EasyBAMWeb'
});

// for use inside Vue files through this.$axios
Vue.prototype.$axios = axiosInstance;

export { axiosInstance };
