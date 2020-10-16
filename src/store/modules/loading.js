const state = {
  loading: false
}

const mutations = {
  TOGGLE_LOADING: (state, value) => {
    state.loading = value
  }
}

const actions = {
  toggleLoading ({ commit }, value) {
    commit('TOGGLE_LOADING', value)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
