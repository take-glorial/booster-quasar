const getters = {
  cachePage: state => state.app.cachePage,
  pageOpenedList: state => state.app.pageOpenedList,
  currentPath: state => state.app.currentPath,
  accessMenu: state => state.app.accessMenu,

  token: state => state.user.token,
  roles: state => state.user.roles,
  loading: state => state.loading.loading
};
export default getters;
