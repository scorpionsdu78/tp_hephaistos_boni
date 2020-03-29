<template>
    <div
      class="mx-auto"
      style="padding: 20px; width: 80%"
      :style="getStyleTheme(themes.Dark, 'background-color')">
      <v-row
        v-for="(module) in modules" :key="module.id">
        <v-col
          md="12">
          <v-card
            class="mx-auto"
            elevation="8"
            style="padding: 20px; margin-top: 20px"
            :style="getStyleTheme(themes.Dark, 'background-color')">
            <v-btn text :href="'#/module/' + module.id">
              <h2 :style="getStyleTheme(themes.Light, 'color')">Module : {{module.name}}</h2>
            </v-btn>

            <v-divider/>

            <v-row>
              <v-col
                cols="12" sm="6" md="3"
                v-for="(session) in getSessionsByModuleId(module.id)" :key="session.id"
              >
                <v-card
                  :href="'#/module/' + module.id + '/session/' + session.id + '/exercise/' + firstExerciseForSession(session.id).id"
                  :style="getStyleTheme((ExercisesForSessionValid(session.id)) ? themes.Success : themes.DarkLight, 'background-color')"
                >
                  <v-list-item
                    style="height: 5em"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        class="text-truncate"
                        style="font-size: 1.5em"
                        :style="getStyleTheme(themes.Light, 'color')"
                      >
                        {{session.name}}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon :style="'color: ' + themes.Light">
                      {{getExercisesBySessionId(session.id).length}}<v-icon style="margin-left: 2px" :color="themes.Light">mdi-code-braces-box</v-icon>
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
    ...mapGetters('exercises', ['getExercisesBySessionId'])
  },
  mounted () {

  },
  methods: {

    firstExerciseForSession (sessionId) {
      return this.getExercisesBySessionId(sessionId)[0] || { title: 'loading' }
    },

    ExercisesForSessionValid (sessionId) {
      let result = true

      this.getExercisesBySessionId(sessionId).forEach(exercise => {
        result = (exercise.valid)
      })

      return result
    }
  }
}
</script>
