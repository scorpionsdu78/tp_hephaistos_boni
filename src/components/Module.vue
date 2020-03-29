<template>

  <div
    class="mx-auto"
    style="padding: 20px; width: 80%"
    :style="'background-color: ' + themes.Dark">
    <v-row
      v-for="(Session) in getSessionsByModuleId(moduleId)" :key="Session.id">
      <v-col
        md="12">
        <v-card
          class="mx-auto"
          elevation="8"
          style="padding: 20px; margin-top: 20px"
          :style="'background-color: ' + themes.Dark">
          <h2 :style="'color: ' + themes.Light">Session : {{Session.name}}</h2>

          <v-divider/>

          <v-row>
            <v-col
              v-for="(exercise) in getExercisesBySessionId(Session.id)" :key="exercise.id"
              cols="12"
              md="3"
              sm="6"
            >
              <v-card
                @click="goToExercise(Session.id, exercise.id)"
                :style="'background-color: ' + ((exercise.valid != null) ? themes.Success : themes.DarkLight)"
              >
                <v-list-item
                  style="height: 5em"
                >
                  <v-list-item-content>
                    <v-list-item-title
                      class="text-truncate"
                      :style="'color: ' + themes.Light"
                    >
                      <span>{{exercise.title}}</span>
                    </v-list-item-title>
                    <v-spacer/>
                    <v-list-item-subtitle
                      class="text-truncate"
                      :style="'color: ' + themes.Light"
                    >
                      {{exercise.lang}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-icon
                    :style="'color: ' + themes.Light"
                  >
                    {{(exercise.test_names != null) ? exercise.test_names.length : '0'}}
                    <v-icon style="margin-left: 2px" :color="themes.Light">mdi-thermostat-box</v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {

  props: [
    'moduleId'
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
    ...mapGetters('modules', ['getModuleById']),
    ...mapGetters('sessions', ['getSessionsByModuleId']),
    ...mapGetters('exercises', ['getExercisesBySessionId']),

    // Customs
    module () {
      return this.getModuleById(this.moduleId) || { name: 'Loading...' }
    }
  },
  mounted () {

  },
  methods: {

    goToExercise (sessionId, exerciseId) {
      this.$router.push({ name: 'Exercise', params: { moduleId: this.moduleId, sessionId, exerciseId } })
    }
  }
}
</script>
