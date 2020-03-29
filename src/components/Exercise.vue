<template>

  <div>
    <div class="d-none" style="margin-left: 16rem"/>
    <div>
      <div
        class="mx-auto"
        style="padding: 20px; width: 90%;"
        :style="'background-color: ' + themes.Dark"
      >
        <v-row>
          <v-col sm="12">
            <v-card
              elevation="4"
              class="mx-auto"
              style="padding-left: 20px; padding-right: 20px"
              :style="'background-color: ' + themes.Dark + '; padding-top: ' + ((instructionHidden) ? '0px' : '20px') + '; padding-bottom: ' + ((instructionHidden) ? '0px' : '20px')"
            >
              <div class="d-flex align-center">
                <v-btn icon style="display: inline-block"
                  @click="instructionHidden = !instructionHidden"
                >
                  <v-icon :color="themes.Light">{{(instructionHidden) ? 'mdi-eye-off' : 'mdi-eye'}}</v-icon>
                </v-btn>
                <h2 :style="getStyleTheme(themes.Light, 'color')" style="padding-left: 1vh; display: inline-block">{{exercise.title || "loading..."}} : </h2>
              </div>
              <v-divider :hidden="instructionHidden"/>
              <div
                :style="getStyleTheme(themes.Light, 'color')"
                style="padding: 1rem 1rem 0 1rem"
                :hidden="instructionHidden"
              >
                <v-skeleton-loader
                  :loading="exercise.instructions == null"
                  transition="scale-transition"
                  class="mx-auto"
                  type="paragraph"
                  dark
                >
                  <div>
                    <div
                      v-html="exercise.instructions"
                    />
                  </div>
                </v-skeleton-loader>
              </div>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="6"
            md="6">
            <v-card
              elevation="4"
              class="mx-auto"
              style="padding: 20px"
              :style="getStyleTheme(themes.Dark, 'background-color')">
              <div class="d-flex align-center" style="padding-left: 4vh">
                <v-icon :color="themes.Light">mdi-alpha-s-box</v-icon>
                <h2 :style="getStyleTheme(themes.Light, 'color')"><label>Solution :</label></h2>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  class="mb-2"
                  tile
                  small
                  @click="runSolution"
                >
                  Run
                  <v-icon>mdi-play</v-icon>
                </v-btn>
              </div>

              <CodeEditorTemplate
                ref="editorSolution"
                :lang="exercise.lang"
                :defaultRegions="(lastAttempt != null) ? lastAttempt.regions : exercise.template_regions"
                :defaultRegionsRW="(lastAttempt != null) ? lastAttempt.regions_rw : exercise.template_regions_rw"
              />

            </v-card>
          </v-col>
          <v-col
            cols="6"
            md="6">
            <TestsResult
              :testsName="(!exercise.loading) ? exercise.test_names : { loading: true }"
              :testsResult="lastAttemptResults.tests"
            />
          </v-col>
        </v-row>
      </div>
    </div>
  </div>

</template>

<script>
import CodeEditorTemplate from '@/components/CodeEditorTemplate.vue'
import TestsResult from '@/components/TestsResult.vue'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: [
    'moduleId',
    'sessionId',
    'exerciseId',
    'drawer'
  ],

  components: {
    CodeEditorTemplate,
    TestsResult
  },

  data: () => ({
    instructionHidden: false,
    lang: 'python'
  }),
  computed: {
    // States
    ...mapState('themes', ['themes']),
    ...mapState('modules', ['modules']),
    ...mapState('sessions', ['sessions']),
    ...mapState('exercises', ['exercises']),
    ...mapState('attempts', ['attempts', 'lastAttemptResults']),

    // Getters
    ...mapGetters('themes', ['getStyleTheme']),
    ...mapGetters('modules', ['getModuleById']),
    ...mapGetters('sessions', ['getSessionById']),
    ...mapGetters('exercises', ['getExerciseById', 'getExercisesBySessionId']),
    ...mapGetters('attempts', ['getLastAttemptForExercise']),

    // Customs
    module () {
      return this.modules.find(module => module.id === this.moduleId) || { name: 'Loading...' }
    },
    exercise () {
      return this.getExerciseById(this.exerciseId) || { lang: 'python', loading: true }
    },
    lastAttempt () {
      return this.getLastAttemptForExercise(this.exerciseId)
    },
    editorSolution () {
      return this.$refs.editorSolution
    }
  },

  async mounted () {
    this.updateView()
  },

  methods: {
    // Actions
    ...mapActions('attempts', ['fetchLastAttemptForExercise']),
    ...mapActions('attempts', ['createAttemptForSession']),

    async updateView () {
      this.instructionHidden = false

      await this.fetchLastAttemptForExercise({ sessionId: this.sessionId, exerciseId: this.exerciseId })

      const solutionRegions = (this.lastAttempt != null) ? this.lastAttempt.regions : this.exercise.template_regions
      const solutionRegionsRW = (this.lastAttempt != null) ? this.lastAttempt.regions_rw : this.exercise.template_regions_rw
      this.editorSolution.updateView(solutionRegions, solutionRegionsRW)
    },

    async runSolution () {
      console.log('running solution...')

      const solution = this.editorSolution.editor.getValue()

      await this.createAttemptForSession({ exerciseId: this.exercise.id, sessionId: this.sessionId, regions: [solution] })
    }
  }
}
</script>
