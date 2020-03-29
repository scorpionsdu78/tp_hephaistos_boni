<template>
  <div
    :style="'background-color: ' + themes.Base"
    style="height: 100%; padding-top: 10px; padding-bottom: 10px">
    <AppBar :title="module.name"/>
    <NavigationDrawer
      :drawer="drawer"
      :moduleId="moduleId"
      :sessionId="sessionId"
      :exerciseId="exerciseId"
    />
    <ExerciseEditComponent
      v-if="userCustom.role === 'Professor'"
      ref="exerciseEditComponent"
      @drawerUpdate="(newDrawer) => drawer = newDrawer"
      :moduleId="moduleId"
      :sessionId="sessionId"
      :exerciseId="exerciseId"
      :drawer="drawer"
    />

    <ExerciseComponent
      v-else
      ref="exerciseComponent"
      :moduleId="moduleId"
      :sessionId="sessionId"
      :exerciseId="exerciseId"
      :drawer="drawer"
    />

  </div>
</template>

<script>
// @ is an alias to /src
import AppBar from '@/components/AppBar.vue'
import NavigationDrawer from '@/components/Exercise_navigationDrawer.vue'
import ExerciseEditComponent from '@/components/Exercise_edit.vue'
import ExerciseComponent from '@/components/Exercise.vue'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Exercise',

  components: {
    AppBar,
    NavigationDrawer,
    ExerciseEditComponent,
    ExerciseComponent
  },

  data: () => ({
    drawer: true
  }),

  computed: {
    // States
    ...mapState('themes', ['themes']),
    ...mapState('userCustom', ['userCustom']),
    ...mapState('modules', ['modules']),
    ...mapState('sessions', ['sessions']),
    ...mapState('exercises', ['exercises']),

    // Getters
    ...mapGetters('themes', ['getStyleTheme']),
    ...mapGetters('modules', ['getModuleById']),
    ...mapGetters('sessions', ['getSessionById']),
    ...mapGetters('exercises', ['getExerciseById', 'getExercisesBySessionId']),

    // Customs
    moduleId () {
      return parseInt(this.$route.params.moduleId)
    },
    module () {
      return this.modules.find(module => module.id === this.moduleId) || { name: 'Loading...' }
    },
    sessionId () {
      return parseInt(this.$route.params.sessionId)
    },
    exerciseId () {
      return parseInt(this.$route.params.exerciseId)
    },
    exercise () {
      return this.getExerciseById(this.exerciseId) || { lang: 'python', loading: true }
    },
    exerciseComponent () {
      return this.$refs.exerciseComponent
    },
    exerciseEditComponent () {
      return this.$refs.exerciseEditComponent
    }
  },

  async mounted () {
    await this.fetchModule({ id: this.moduleId })

    if (this.getModuleById(this.moduleId) === undefined) {
      this.$router.push({ name: 'Modules' })
    }

    await this.fetchSession({ id: this.sessionId })

    if (this.getSessionById(this.sessionId) === undefined) {
      this.$router.push({ name: 'Module', params: { moduleId: this.moduleId } })
    }

    await this.fetchExercisesForSession({ sessionId: this.sessionId })

    this.updateView()
  },

  watch: {
    exerciseId: function (newV, oldV) {
      this.updateView()
    }
  },

  methods: {
    // Actions
    ...mapActions('modules', ['fetchModule']),
    ...mapActions('sessions', ['fetchSession']),
    ...mapActions('exercises', ['fetchExerciseForSession']),
    ...mapActions('exercises', ['fetchExercisesForSession']),

    async updateView () {
      await this.fetchExerciseForSession({ sessionId: this.sessionId, exerciseId: this.exerciseId })

      if (this.userCustom.role === 'Professor') {
        this.exerciseEditComponent.updateView()
      } else {
        this.exerciseComponent.updateView()
      }
    }
  }
}
</script>
