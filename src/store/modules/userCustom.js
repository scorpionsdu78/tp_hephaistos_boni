const state = {
  userCustom: {
    role: 'Student'
  }
}

const getters = {
  isProfessor: state => state.role === 'Professor'
}

const mutations = {
  toggleRole (state) {
    if (state.userCustom.role === 'Professor') {
      state.userCustom.role = 'Student'
    } else {
      state.userCustom.role = 'Professor'
    }
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
