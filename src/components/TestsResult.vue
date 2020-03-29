<template>
  <div>
    <v-card
      elevation="4"
      class="mx-auto"
      style="padding: 20px;"
      :style="'background-color :' + themes.Dark"
    >
      <div class="d-flex align-center" style="padding-left: 3vh">
        <v-icon :color="themes.Light">mdi-thermostat-box</v-icon>
        <h2 :style="'color :' + themes.Light"><label>Tests :</label></h2>
      </div>

      <v-divider/>

      <div
        style="padding: 15px; overflow-x: auto; height: 74.5vh"
        :style="'color :' + themes.Light">

        <div v-if="testsResult != null" >
          <div v-for="(result) in testsResult" :key="result.name">
            <v-card
              v-if="result.failure"
              :color="themes.Failure"
              dark
              style="margin: 10px 0px 0px 0px;"
            >
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-alert-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  {{result.failure.message}}
                  <!-- Bug on hidden ! -->
                  <code style="font-size: 12px; padding: 5px">{{result.failure.stacktrace}}</code>
                  <v-list-item-subtitle>{{result.file}} - {{result.name}} - {{result.time}}ms</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-icon class="d-felx align-end">
                  <v-btn
                    icon
                    v-if="false"
                  >
                    <v-icon>mdi-chevron-up</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    v-else
                  >
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </v-card>
            <v-card
              v-else
              :color="themes.Success"
              dark
              style="margin: 10px 0px 0px 0px;"
              >
              <v-row>
                <v-col md="1" class="d-flex align-center" style="max-width: 20px">
                  <v-icon style="padding-left: 15px">mdi-check</v-icon>
                </v-col>
                <v-col md="11">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-subtitle>{{result.file}} - {{result.name}} - {{result.time}}ms</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-card>
          </div>
        </div>

        <div v-else>
          <div v-for="(result) in testsName" :key="result.name">
            <v-skeleton-loader
              :loading="testsName.loading"
              transition="fade-transition"
              style="margin: 10px 0px 0px 0px;"
              type="list-item-avatar"
              dark
            >
              <v-card
                :color="themes.DarkLight"
                dark
                style="margin: 10px 0px 0px 0px;"
                >
                <v-row>
                  <v-col md="1" class="d-flex align-center" style="max-width: 20px">
                    <v-icon style="padding-left: 15px">mdi-dots-horizontal</v-icon>
                  </v-col>
                  <v-col md="11" style="padding-left: 25px">
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-subtitle>{{result}}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-col>
                </v-row>
              </v-card>
            </v-skeleton-loader>
          </div>
        </div>

      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: ['testsResult', 'testsName'],
  data: () => ({
  }),
  computed: {
    ...mapState('themes', ['themes'])
  },

  mounted () {
  },

  methods: {
  }
}
</script>
