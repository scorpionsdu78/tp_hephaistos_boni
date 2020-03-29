<template>
  <div class="custom-ace-editor" ref="editor"/>
</template>

<script>
import ace from 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/webpack-resolver'
const Range = ace.require('ace/range').Range

export default {
  props: [
    'lang',
    'defaultRegions',
    'defaultRegionsRW',
    'admin'
  ],
  data: () => ({
    editor: null,
    regions: [''],
    regionsRW: []
  }),
  computed: {
  },

  mounted () {
    this.editor = ace.edit(this.$refs.editor)

    this.editor.setTheme('ace/theme/monokai') // Global theme for

    this.editor.setOptions({
      selectionStyle: 'line',
      cursorStyle: 'ace'
    })

    // React to changes and update the v-model
    this.editor.on('change', () => {
      this.$emit('input', this.editor.getValue())
    })

    if (this.admin === true) {
      this.editor.on('guttermousedown', this.onGutterMouseDown)
    }

    const vm = this

    this.editor.selection.on('changeSelection', function (e) {
      vm.updateReadOnly()
    })

    this.editor.selection.on('changeCursor', function (e) {
      vm.updateReadOnly()
    })

    this.updateView(this.defaultRegions, this.defaultRegionsRW)
  },

  methods: {

    getRegions () {
      return {
        regions: this.regions,
        regionsRW: this.regionsRW
      }
    },

    updateReadOnly () {
      const startRow = this.editor.getSelection().getRange().start.row
      const endRow = this.editor.getSelection().getRange().end.row

      for (let i = 0, lines = 0; lines <= endRow && i < this.regions.length; i++) {
        if (this.admin || (this.regionsRW[i] & 4) === 4) {
          lines += (this.regions[i].match(/\n/g) || []).length
          if (lines - 1 >= startRow && (this.regionsRW[i] & 6) !== 6) {
            this.editor.setReadOnly(true)
            return
          }
        }
      }

      this.editor.setReadOnly(false)
    },

    updateView (defaultRegions, defaultRegionsRW) {
      // On récupère les nouvelles données
      this.regions = defaultRegions || ['']
      this.regionsRW = defaultRegionsRW || [6]

      // On réinit l'editeur avec la bonne lang etc...
      this.editor.session.setMode(`ace/mode/${this.lang}`)
      this.editor.selection.addRange()
      this.editor.resize() // Ensure the editor is the right size

      // On transforme le tableau en entrée en un string pour remplir l'editeur
      let lines = ''

      for (let i = 0; i < this.regions.length; i++) {
        if (this.admin || (this.regionsRW[i] & 4) === 4) {
          lines += this.regions[i]
        }
      }
      this.editor.setValue(lines)

      // On regarde si il y a déjà des markers dans l'editeur, si c'est le cas on les supprimes
      const markers = this.editor.getSession().getMarkers(false)

      for (const i in this.editor.getSession().$decorations) {
        this.editor.getSession().removeGutterDecoration(i, 'ace_gutter-cell_template-lock')
        this.editor.getSession().removeGutterDecoration(i, 'ace_gutter-cell_template-hidden')
      }
      for (const index in markers) {
        const marker = markers[index]
        if (marker.range && marker.type === 'line' && marker.clazz !== 'ace_selection') {
          this.editor.getSession().removeMarker(marker.id)
        }
      }

      // On met les nouveaux markers sur chaque lignes
      let indexCont = 0
      for (let i = 0; i < this.regions.length; i++) {
        const numberLines = (this.regions[i].match(/\n/g) || []).length
        let decorationName
        switch (this.regionsRW[i]) {
          case 0:
            decorationName = 'hidden'
            break
          case 4:
            decorationName = 'lock'
        }

        if ((decorationName === 'hidden' && this.admin) || decorationName === 'lock') {
          this.editor.getSession().addMarker(new Range(indexCont, 0, indexCont + numberLines - 1, 2000), 'ace_template-' + decorationName, 'line', false)

          for (let j = indexCont; j < indexCont + numberLines; j++) {
            this.editor.getSession().addGutterDecoration(j, 'ace_gutter-cell_template-' + decorationName)
          }
        }

        indexCont += (decorationName !== 'hidden' || this.admin) ? numberLines : 0
      }
    },

    onGutterMouseDown (e) {
      const target = e.domEvent.target

      // On vérifie que on a bien focus l'editeur et qu'on est sur la zone du gutter
      if (target.className.indexOf('ace_gutter-cell') === -1) {
        return
      }
      if (!e.editor.isFocused()) {
        return
      }

      const row = e.getDocumentPosition().row

      // On cherche l'index de la région
      let index
      let startRow
      let endRow

      for (let i = 0, lines = 0; i < this.regions.length; i++) {
        startRow = lines
        endRow = lines + (this.regions[i].match(/\n/g) || []).length - 1

        if (row >= startRow && row <= endRow) {
          index = i
          break
        }

        lines = endRow + 1
      }

      const prefix = (row !== startRow)
      const suffixe = (row !== endRow)

      // Si il y a plus d'une ligne dans la region, on doit séparer la ligne de sa région
      if (startRow !== endRow) {
        // On découpe cet index par ligne et on la clear
        const region = this.regions[index].split('\n')

        this.regions[index] = ''

        let prefixLength
        // On recrée la région avant notre ligne
        for (prefixLength = 0; row !== startRow + prefixLength; prefixLength++) {
          this.regions[index] += region[prefixLength] + '\n'
        }

        // On regarde si on aura besoin d'un suffixe et on calcul le npùbre de lignes supplémentaire
        const rowSup = (prefix && suffixe) ? 2 : 1

        // On attribut la place supplémentaire et on décale
        this.regions.length += rowSup
        this.regionsRW.length += rowSup

        for (let i = this.regions.length - 1; i > index + rowSup; i--) {
          this.regions[i] = this.regions[i - rowSup]
          this.regionsRW[i] = this.regionsRW[i - rowSup]
        }

        // On crée la nouvelle région
        index += (prefix) ? 1 : 0
        this.regions[index] = region[prefixLength] + '\n'
        this.regionsRW[index] = this.regionsRW[index - ((prefix) ? 1 : 0)]

        // Enfin, si on devait mettre un suffixe, on le rajoute
        if (suffixe) {
          this.regionsRW[index + 1] = this.regionsRW[index]

          this.regions[index + 1] = ''
          for (prefixLength += 1; prefixLength < region.length - 1; prefixLength++) {
            this.regions[index + 1] += region[prefixLength] + '\n'
          }
        }
      }

      switch (this.regionsRW[index]) {
        case 0:
          this.regionsRW[index] = 6
          break
        case 4:
          this.regionsRW[index] = 0
          break
        case 6:
          this.regionsRW[index] = 4
          break
      }

      // On merge les regions autour de la nouvelle region
      if (!prefix && this.regionsRW[index] === this.regionsRW[index - 1]) {
        this.regions[index - 1] += this.regions[index]

        for (let i = index; i < this.regions.length - 1; i++) {
          this.regions[i] = this.regions[i + 1]
          this.regionsRW[i] = this.regionsRW[i + 1]
        }

        this.regions.length -= 1
        this.regionsRW.length -= 1
        index -= 1
      }

      if (!suffixe && this.regionsRW[index] === this.regionsRW[index + 1]) {
        this.regions[index] += this.regions[index + 1]

        for (let i = index + 1; i < this.regions.length - 1; i++) {
          this.regions[i] = this.regions[i + 1]
          this.regionsRW[i] = this.regionsRW[i + 1]
        }

        this.regions.length -= 1
        this.regionsRW.length -= 1
      }

      this.updateView(this.regions, this.regionsRW)
      this.updateReadOnly()
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

<style>
.custom-ace-editor.ace_breakpoint {
  background-color: aqua;
}

.ace_template-lock
{
    background-color: rgba(139, 169, 170, 0.247);
    position: absolute;
    width: 100% !important;
    left: 0 !important;
}
.ace_gutter-cell_template-lock {
  box-shadow: 0px 0px 1px 1px rgba(139, 169, 170, 0.87) inset;
  background-color: rgba(139, 169, 170, 0.247);
}

.ace_template-hidden
{
    background-color: rgba(4, 82, 11, 0.247);
    position: absolute;
    width: 100% !important;
    left: 0 !important;
}
.ace_gutter-cell_template-hidden {
  box-shadow: 0px 0px 1px 1px rgba(4, 82, 11, 0.87) inset;
  background-color: rgba(4, 82, 11, 0.247);
}
</style>
