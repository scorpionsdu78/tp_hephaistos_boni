<template>
  <div
    style="min-height: 100%; overflow: auto"
    :style="getStyleTheme(themes.Base, 'background-color')"
  >
    <v-app-bar
      app
      dark
    >
        <a class="d-flex align-center"
          :href="'#/modules'"
        >
          <v-img
            alt="Efrei Logo"
            class="shrink mr-2"
            contain
            src="@/assets/efrei_logo.png"
            transition="scale-transition"
            width="40"
          />

          <v-img
            alt="Efrei Name"
            class="shrink mt-1 hidden-sm-and-down"
            contain
            min-width="100"
            src="@/assets/efrei_name_logo.png"
            width="100"
          />
        </a>

      <v-spacer></v-spacer>

      <h1 :style="getStyleTheme(themes.Light, 'color')">{{(getModuleById(moduleId) != null) ? this.getModuleById(moduleId).name : ''}}</h1>

      <v-spacer></v-spacer>

      <v-btn
        href=""
        text
        @click="logOut"
      >
        <span class="mr-2">Log out</span>
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      class="d-none d-md-flex"
      absolute
      permanent
    >
      <div
        style="padding: 5px; min-height: 100%"
        :style="getStyleTheme(themes.Dark, 'background-color')">

        <h1 :style="getStyleTheme(themes.Light, 'color')" style="height: 5%; margin-top: 5px; padding-left: 5%">{{(getSessionById(sessionId) != null) ? getSessionById(sessionId).name : ''}}</h1>

        <v-list style="overflow-y: auto; padding: 0px 5px 0px 0px">
          <v-list-item
            v-for="(Exercise) in getExercisesBySessionId(sessionId)" :key="Exercise.id"
            @click="changeExercise(Exercise.id)"
          >
            <v-list-item-content
              class="text-truncate"
              style="font-size: 17px"
              :style="getStyleTheme(themes.Light, 'color')"
            >
              <span>{{Exercise.title}}</span>
            </v-list-item-content>
            <v-list-item-icon
              :style="'color: ' + themes.Light">
              {{(Exercise.test_names != null) ? Exercise.test_names.length : '0'}}<v-icon :color="themes.Light">mdi-thermostat-box</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>

    <div style="background-color: yellow;">
      <div class="d-md-inline-block d-none" style="background-color: red; margin-left: 16rem;"/>
      <div class="d-inline-block" style="background-color: blue; padding: 20px; width: 80%">
        <div class="mx-auto" style="width: 100%">
          t
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'
import testsPy from '@/assets/tests.txt'

export default {

  data: () => ({
    instructionHidden: false,
    moduleId: 1,
    sessionId: 2,
    exerciseId: null,
    exercise: null,
    lang: 'python',
    resultTest: [],
    editorSolution: null
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
    ...mapGetters('exercises', ['getExerciseById']),
    ...mapGetters('exercises', ['getExercisesBySessionId'])
  },
  async mounted () {
    this.exerciseId = parseInt(this.$route.params.exerciseId)

    await this.fetchModule({ id: this.moduleId })

    if (this.getModuleById(this.moduleId) === undefined) {
      this.$router.push({ name: 'Modules' })
    }

    await this.fetchSession({ id: this.sessionId })

    if (this.getSessionById(this.sessionId) === undefined) {
      this.$router.push({ name: 'Module', params: { moduleId: this.moduleId } })
    }

    await this.fetchExercisesForSession({ sessionId: this.sessionId })

    if (!!this.exerciseId === true) {
      console.log('not null')
      console.log(!!this.exerciseId)
      this.exercise = this.getExerciseById(this.exerciseId)
    } else {
      console.log('null')
      this.exercise = this.getExercisesBySessionId(this.sessionId)[0]
    }

    this.changeExercise(this.exercise.id)
  },
  methods: {
    // Actions
    ...mapActions('modules', ['fetchModule']),
    ...mapActions('sessions', ['fetchSession']),
    ...mapActions('exercises', ['fetchExerciseForSession']),
    ...mapActions('exercises', ['fetchExercisesForSession']),

    logOut () {
      this.$router.push({ name: 'Login' })
    },

    async changeExercise (exerciseId) {
      await this.fetchExerciseForSession({ sessionId: this.sessionId, exerciseId })
      this.exercise = this.getExerciseById(exerciseId)

      this.instructionHidden = false

      this.editorSolution = ace.edit(this.$refs.editorSolution)
      this.initEditor(this.editorSolution, this.exercise.lang, 'print("This is a solution for ' + this.exercise.title + '")')
    },

    toggleInstructionHidden () {
      this.instructionHidden = !this.instructionHidden
    },

    initEditor (editor, lang, defaultValue) {
      editor.setTheme('ace/theme/monokai') // Global theme for
      editor.session.setMode(`ace/mode/${lang}`)

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

    runSolution () {
      console.log('running sandbox...')

      this.tests = testsPy
      this.editorTests.setValue(this.tests)
      this.solution = this.editorSandbox.getValue()

      this.axios.post('http://localhost:3000/api/v1/exercise/sandbox', {
        lang: this.lang,
        tests: this.tests,
        solution: this.solution
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
    }
  }
}
</script>

<style scoped>
.custom-ace-editor {
  position: relative;
  height: 65vh;
}
</style>
