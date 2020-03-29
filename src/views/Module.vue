<template>
  <div
    :style="'background-color: ' + themes.Base"
    style="height: 100%; padding-top: 30px; padding-bottom: 30px">
    <AppBar :title="module.name"/>
    <ModuleComponent :moduleId="moduleId"/>
  </div>
</template>

<script>
// @ is an alias to /src
import AppBar from '@/components/AppBar.vue'
import ModuleComponent from '@/components/Module.vue'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Module',
  components: {
    AppBar,
    ModuleComponent
  },

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
    ...mapGetters('sessions', ['getSessionsByModuleId']),
    ...mapGetters('exercises', ['getExercisesBySessionId']),

    // Customs
    moduleId () {
      return parseInt(this.$route.params.moduleId)
    },
    module () {
      return this.modules.find(module => module.id === this.moduleId) || { name: 'Loading...' }
    }
  },
  async mounted () {
    await this.fetchModule({ id: this.moduleId })

    if (this.module === null) {
      this.$router.push({ name: 'Modules' })
    }

    await Promise.all(
      this.modules.map(module_ => {
        return this.fetchSessionsForModule({ moduleId: module_.id })
      })
    )

    await Promise.all(
      this.sessions.map(session => {
        return this.fetchExercisesForSession({ sessionId: session.id })
      })
    )
  },
  methods: {
    // Actions
    ...mapActions('modules', ['fetchModule']),
    ...mapActions('sessions', ['fetchSessionsForModule']),
    ...mapActions('exercises', ['fetchExercisesForSession'])
  }
}
</script>
