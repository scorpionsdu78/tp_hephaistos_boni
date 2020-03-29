<template>
  <div class="custom-ace-editor" ref="editor"/>
</template>

<script>
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'

export default {
  props: [
    'lang',
    'defaultValue'
  ],
  data: () => ({
    editor: null
  }),
  computed: {
  },

  mounted () {
    this.editor = ace.edit(this.$refs.editor)

    this.updateView(this.defaultValue || 'loading...')
  },

  methods: {

    updateView (solutionDefault) {
      this.editor.setTheme('ace/theme/monokai') // Global theme for
      this.editor.session.setMode(`ace/mode/${this.lang}`)

      this.editor.selection.addRange()

      this.editor.setOptions({
        selectionStyle: 'line',
        cursorStyle: 'ace'
      })

      this.editor.resize() // Ensure the editor is the right size

      // React to changes and update the v-model
      this.editor.on('change', () => {
        this.$emit('input', this.editor.getValue())
      })

      this.editor.setValue(solutionDefault)
    }
  },

  watch: {
    lang: function () {
      this.editor.session.setMode(`ace/mode/${this.lang}`)
    }
  }
}
</script>

<style scoped>
.custom-ace-editor {
  position: relative;
  height: 74.5vh;
}
</style>
