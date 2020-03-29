<template>

  <v-navigation-drawer
    v-model="drawer"
    class="d-none d-md-flex"
    app
    clipped
    dark
  >
    <div
      style="padding: 5px; min-height: 100%"
      :style="getStyleTheme(themes.Dark, 'background-color')">

      <div class="d-flex align-center">
        <v-btn
          icon
          :color="themes.Light"
          class="d-inline-block"
          @click="$router.push({ name: 'Module', params: { moduleId } })"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h1
          class="d-inline-block"
          :style="getStyleTheme(themes.Light, 'color')"
          style="height: 5%; margin-top: 5px; padding-left: 5%"
        >
          {{(getSessionById(sessionId) != null) ? getSessionById(sessionId).name : ''}}
        </h1>
      </div>

      <v-divider/>

      <v-list
        dark
        style="padding: 0px 5px 0px 0px;">
        <v-list-item
          v-for="(exercise) in getExercisesBySessionId(sessionId)" :key="exercise.id"
          two-line
          @click="goToExercise(exercise.id)"
          :style="(exercise.valid != null) ? 'background-color: ' + themes.Success : ''"
        >
          <v-list-item-content>
            <v-list-item-title
              class="text-truncate"
              :style="getStyleTheme(themes.Light, 'color')"
            >
              <span>{{exercise.title}}</span>
            </v-list-item-title>
            <v-list-item-subtitle
              class="text-truncate"
              :style="getStyleTheme(themes.Light, 'color')"
            >
              <span>{{exercise.lang}}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-icon
            :style="'color: ' + themes.Light"
          >
            {{(exercise.test_names != null) ? exercise.test_names.length : '0'}}<v-icon :color="themes.Light">mdi-thermostat-box</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>

</template>

<script>

import { mapState, mapGetters } from 'vuex'

export default {
  props: [
    'drawer',
    'moduleId',
    'sessionId',
    'exerciseId'
  ],
  data: () => ({

  }),
  computed: {
    // States
    ...mapState('themes', ['themes']),
    ...mapState('modules', ['modules']),
    ...mapState('sessions', ['sessions']),
    ...mapState('exercises', ['exercises']),

    // Getters
    ...mapGetters('themes', ['getStyleTheme']),
    ...mapGetters('modules', ['getModuleById']),
    ...mapGetters('sessions', ['getSessionById']),
    ...mapGetters('exercises', ['getExerciseById', 'getExercisesBySessionId']),

    // Customs
    module () {
      return this.modules.find(module => module.id === this.moduleId) || { name: 'Loading...' }
    },
    exercise () {
      return this.getExerciseById(this.exerciseId) || { lang: 'python', loading: true }
    }
  },

  mounted () {

  },

  methods: {

    goToExercise (exerciseId) {
      if (exerciseId !== this.exerciseId) {
        this.$router.push({ name: 'Exercise', params: { moduleId: this.moduleId, sessionId: this.sessionId, exerciseId } })
      }
    }
  }
}
</script>
