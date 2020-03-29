<template>

  <div>

    <v-dialog
      v-model="dialogRun"
      hide-overlay
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-title>Run successful</v-card-title>
        <v-card-text>{{dialogRunText}}</v-card-text>
      </v-card>
    </v-dialog>

    <div class="d-none" style="margin-left: 16rem"/>
    <div>
      <div
        class="mx-auto"
        style="padding: 20px; width: 90%;"
        :style="'background-color: ' + themes.Dark"
      >
        <v-row>
          <v-col cols="12">
            <v-card
              elevation="4"
              class="mx-auto"
              style="padding-left: 20px; padding-right: 20px"
              :style="'background-color: ' + themes.Dark + '; padding-top: ' + ((instructionsHidden) ? '0px' : '20px') + '; padding-bottom: ' + ((instructionsHidden) ? '0px' : '20px')"
            >
              <div class="d-flex align-center">
                <v-btn icon style="display: inline-block"
                  @click="instructionsHidden = !instructionsHidden"
                >
                  <v-icon :color="themes.Light">{{(instructionsHidden) ? 'mdi-eye-off' : 'mdi-eye'}}</v-icon>
                </v-btn>
                <v-text-field
                  v-model="exercise.title"
                  label="Exercise name"
                  dark
                  single-line
                  dense
                  class="d-flex align-center"
                  style="padding-left: 1vh;"
                  :style="'color: ' + themes.Light"
                />
                <v-spacer/>
                <v-select
                  style="width: 5vh"
                  v-model="exercise.lang"
                  :items="langs"
                  dense
                  dark
                />
                <v-btn
                  style="margin-left: 20px"
                  :style="'background-color: ' + themes.DarkLight"
                  dark
                  tile
                  dense
                  small
                  @click="saveExercise()"
                >
                  <v-icon
                    :style="'color: ' + themes.Light"
                  >mdi-content-save</v-icon>
                </v-btn>
                <v-btn
                  style="margin-left: 20px"
                  :style="'background-color: ' + themes.DarkLight"
                  dark
                  tile
                  dense
                  small
                >
                  <v-icon
                    :style="'color: ' + themes.Light"
                  >mdi-delete</v-icon>
                </v-btn>
                <div style="padding-left: 2vh">
                  <v-btn icon v-if="drawer">
                    <v-icon
                      @click="$emit('drawerUpdate', !drawer)"
                      :style="'color: ' + themes.Light"
                    >mdi-arrow-expand-all</v-icon>
                  </v-btn>
                  <v-btn icon v-if="!drawer">
                    <v-icon
                      @click="$emit('drawerUpdate', !drawer)"
                      :style="'color: ' + themes.Light"
                    >mdi-arrow-collapse-all</v-icon>
                  </v-btn>
                </div>
              </div>

              <div
                :style="'color: ' + themes.Light"
                style="padding: 0rem 1rem 0 1rem"
                :hidden="instructionsHidden"
              >
                <v-divider style="padding-bottom: 1rem"/>

                <v-skeleton-loader
                  :loading="exercise.instructions == null"
                  transition="fade-transition"
                  class="mx-auto"
                  type="list-item-three-line"
                  dark
                >
                  <v-textarea
                    v-model="exercise.instructions"
                    dark
                    solo
                    flat
                    no-resize
                  />
                </v-skeleton-loader>

                <v-divider style="padding-bottom: 1rem"/>

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
            :cols="(expandTest) ? 12 : 6"
          >
            <v-card
              elevation="8"
              class="mx-auto"
              style="padding: 20px"
              :style="getStyleTheme(themes.Dark, 'background-color')">

              <div class="d-flex align-center" style="padding-left: 3vh">
                <v-icon :color="themes.Light">mdi-sigma</v-icon>
                <h2 :style="'color: ' + themes.Light"><label>Test :</label></h2>
                <v-spacer/>
                <v-icon @click="expandTest = !expandTest" v-if="!expandTest" :style="'color: ' + themes.Light">mdi-arrow-collapse-right</v-icon>
                <v-icon @click="expandTest = !expandTest" v-if="expandTest" :style="'color: ' + themes.Light">mdi-arrow-collapse-left</v-icon>
              </div>

              <CodeEditor
                ref="editorTests"
                :lang="exercise.lang"
                :defaultValue="(lastAttempt != null) ? lastAttempt.solution : 'loading...'"
              />

            </v-card>
          </v-col>
          <v-col
            :cols="(expandTest) ? 0 : 6"
          >
            <v-card
              elevation="8"
              class="mx-auto"
              style="padding: 20px"
              :style="'background-color: ' + themes.Dark">
              <div class="d-flex align-center">
                <div class="d-flex align-center" style="padding-left: 3vh">
                  <v-icon :color="themes.Light">mdi-alpha-t-box</v-icon>
                  <h2 :style="'color: ' + themes.Light"><label>Template :</label></h2>
                </div>
                <v-spacer></v-spacer>
                <v-btn
                  color="success"
                  class="mb-2"
                  tile
                  small
                  @click="runSandbox"
                >
                  Run
                  <v-icon>mdi-play</v-icon>
                </v-btn>
              </div>

              <CodeEditorTemplate
                ref="editorTemplate"
                :lang="exercise.lang"
                :defaultRegions="exercise.template_regions || ['loading...']"
                :defaultRegionsRW="exercise.template_regions_rw || [4]"
                admin="true"
              />

            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="6"
            md="6">
            <v-card
              elevation="8"
              class="mx-auto"
              style="padding: 20px;"
              :style="getStyleTheme(themes.Dark, 'background-color')"
            >
              <div class="d-flex align-center" style="padding-left: 3vh">
                <v-icon :color="themes.Light">mdi-console</v-icon>
                <h2 :style="getStyleTheme(themes.Light, 'color')"><label>Console output :</label></h2>
              </div>

              <code
              style="height: 74.5vh; padding: 5px; overflow: auto; font-size: 12px; width: 100%"
              :style="getStyleTheme(themes.DarkLight, 'background-color') + '; ' + getStyleTheme(themes.Light, 'color')"
              >
                {{consoleOutput}}
              </code>
            </v-card>
          </v-col>
          <v-col
            cols="6"
            md="6">
            <TestsResult
              :testsName="(!exercise.loading) ? exercise.test_names : { loading: true }"
              :testsResult="resultTest"
            />
          </v-col>
        </v-row>
      </div>
    </div>

  </div>

</template>

<script>
import CodeEditor from '@/components/CodeEditor.vue'
import CodeEditorTemplate from '@/components/CodeEditorTemplate.vue'
import TestsResult from '@/components/TestsResult.vue'

import config from '../client.config'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: [
    'moduleId',
    'sessionId',
    'exerciseId',
    'drawer'
  ],

  components: {
    CodeEditor,
    CodeEditorTemplate,
    TestsResult
  },

  data: () => ({
    dialogRun: false,
    dialogRunText: '',
    instructionsHidden: false,
    consoleOutput: '',
    resultTest: [],
    expandTest: false
  }),
  computed: {
    // States
    ...mapState('themes', ['themes']),
    ...mapState('langs', ['langs']),
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
    editorTests () {
      return this.$refs.editorTests
    },
    editorTemplate () {
      return this.$refs.editorTemplate
    }
  },
  mounted () {
    this.updateView()
  },
  methods: {
    // Actions
    ...mapActions('exercises', ['updateExerciseForSession']),
    ...mapActions('attempts', ['fetchLastAttemptForExercise']),

    async updateView () {
      await this.fetchLastAttemptForExercise({ sessionId: this.sessionId, exerciseId: this.exerciseId })

      const TestsDefault = (this.exercise.tests != null) ? this.exercise.tests : 'print("This is a test for ' + this.exercise.title + '")'
      this.editorTests.updateView(TestsDefault)

      this.editorTemplate.updateView(this.exercise.template_regions || ['Loading...'], this.exercise.template_regions_rw || [4])

      this.resultTest.length = 0
      this.consoleOutput = ''
    },

    initEditor (editor, defaultValue) {
      editor.setTheme('ace/theme/monokai') // Global theme for
      editor.session.setMode(`ace/mode/${this.exercise.lang}`)

      editor.selection.addRange()

      editor.setOptions({
        selectionStyle: 'line',
        cursorStyle: 'ace'
      })

      editor.resize() // Ensure the editor is the right size

      // React to changes and update the v-model
      editor.on('change', () => {
        this.$emit('input', editor.getValue())
      })

      editor.setValue(defaultValue)
    },

    saveExercise () {
      console.log('Saving exercise...')

      const regions = this.editorTemplate.getRegions()
      this.exercise.template_regions = regions.regions
      this.exercise.template_regions_rw = regions.regionsRW
      this.exercise.tests = this.editorTests.editor.getValue()

      this.updateExerciseForSession({ id: this.exerciseId, sessionId: this.sessionId, exercise: this.exercise })
    },

    runSandbox () {
      console.log('running sandbox...')

      const tests = this.editorTests.editor.getValue()
      const solution = this.editorTemplate.editor.getValue()

      this.axios.post(config.apiURL + '/exercise/sandbox', {
        lang: this.exercise.lang,
        tests,
        solution
      })
        .then((response) => {
          console.log(response.data.result.stats.tests + ' tests run in ' + response.data.result.stats.time)
          this.openRunDialog(response.data.result.stats.tests + ' tests run in ' + response.data.result.stats.time)

          this.consoleOutput = response.data.stdout
          this.resultTest.length = 0

          response.data.result.tests.forEach((result) => {
            result.stacktraceHidden = true
            this.resultTest.push(result)
          })
        })
        .catch((err) => {
          console.log(err)
          console.log(err.response)
        })
    },

    openRunDialog (text) {
      this.dialogRunText = text
      this.dialogRun = true
    }
  }
}
</script>

<style scoped>
.custom-ace-editor {
  position: relative;
  min-height: 30rem;
  margin-bottom: 30px;
}
</style>
