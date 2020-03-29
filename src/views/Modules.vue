<template>
  <div
    :style="'background-color: ' + themes.Base"
    style="min-height: 100%; padding-top: 30px; padding-bottom: 30px">
    <AppBar title="Modules"/>
    <ModulesComponent/>
  </div>
</template>

<script>
// @ is an alias to /src
import AppBar from '@/components/AppBar.vue'
import ModulesComponent from '@/components/Modules.vue'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'Modules',
  components: {
    AppBar,
    ModulesComponent
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
    ...mapGetters('sessions', ['getSessionsByModuleId']),
    ...mapGetters('exercises', ['getExercisesBySessionId'])
  },
  async mounted () {
    await this.fetchModules()

    await Promise.all(
      this.modules.map(module => {
        return this.fetchSessionsForModule({ moduleId: module.id })
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
    ...mapActions('modules', ['fetchModules']),
    ...mapActions('sessions', ['fetchSessionsForModule']),
    ...mapActions('exercises', ['fetchExercisesForSession'])
  }
}
</script>
