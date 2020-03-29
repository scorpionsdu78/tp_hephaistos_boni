import Vue from 'vue'
import Vuex from 'vuex'
import exercisesStore from './modules/exercises'
import userStore from './modules/user'
import modulesStore from './modules/modules'
import sessionsStore from './modules/sessions'
import attemptsStore from './modules/attempts'
import usersStore from './modules/users'
import rolesStore from './modules/roles'
import themesStore from './modules/themes'
import langsStore from './modules/langs'
import userCustomStore from './modules/userCustom'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  actions: {},
  mutations: {},
  getters: {},
  modules: {
    exercises: exercisesStore,
    user: userStore,
    modules: modulesStore,
    sessions: sessionsStore,
    attempts: attemptsStore,
    users: usersStore,
    roles: rolesStore,
    themes: themesStore,
    langs: langsStore,
    userCustom: userCustomStore
  }
})
