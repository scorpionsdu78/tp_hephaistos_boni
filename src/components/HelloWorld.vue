<template>
  <v-container style="height: 2000px">
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col class="mb-4">
        <v-btn
          :loading="btnLoading"
          @click="login">
          Test axios
        </v-btn>
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to Vuetify
        </h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'HelloWorld',

  data: () => ({
    btnLoading: false
  }),
  methods: {
    login () {
      this.btnLoading = true
      this.axios.post('http://localhost:3000/api/v1/login', {
        username: 'eddy.dulche@efrei.net',
        password: '18A1aHAYJ0'
      })
        .then((response) => {
          console.log(response.data)
          setTimeout(
            () => {
              this.btnLoading = false
            },
            1000)
        })
        .catch((err) => console.log(err))
    }
  }
}
</script>
