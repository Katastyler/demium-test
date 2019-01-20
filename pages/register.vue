<template>
  <b-container class="login-container">
    <b-form @submit="onSubmit">
      <h1>Registration page</h1>
      <b-form-group id="userInputGroup" label="Username:" label-for="userInput">
        <b-form-input
          id="userInput"
          v-model="form.username"
          type="text"
          required
          placeholder="Amazing Name"
        />
      </b-form-group>
      <b-form-group id="pwdInputGroup" label="Password:" label-for="pwdInput">
        <b-form-input
          id="pwdInput"
          v-model="form.password"
          type="password"
          required
          placeholder="Amazing password"
        />
      </b-form-group>
      <b-button type="submit" variant="primary">
        Sing up
      </b-button>
    </b-form>
  </b-container>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault()

      try {
        const res = await this.$axios.$post(
          'https://apitrello.herokuapp.com/users',
          this.form
        )
        if (res) this.$nuxt.$router.replace({ path: 'login' })
      } catch (error) {
        alert(error)
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  padding-top: 10%;
}
</style>
