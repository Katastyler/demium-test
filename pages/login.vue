<template>
  <b-container class="login-container">
    <b-form @submit="onSubmit">
      <h1>Login Page</h1>
      <b-form-group id="userInputGroup" label="Username:" label-for="userInput">
        <b-form-input
          id="userInput"
          v-model="form.username"
          type="text"
          :state="usernameState"
          required
          placeholder="Amazing Name"
        />
        <b-form-invalid-feedback id="userInputFeedback">{{ usernameError }}</b-form-invalid-feedback>
      </b-form-group>
      <b-form-group id="pwdInputGroup" label="Password:" label-for="pwdInput">
        <b-form-input
          id="pwdInput"
          v-model="form.password"
          type="password"
          :state="passwordState"
          required
          placeholder="Amazing password"
        />
        <b-form-invalid-feedback id="pwdInputFeedback">{{ passwordError }}</b-form-invalid-feedback>
      </b-form-group>
      <b-button type="submit" variant="primary">Log in</b-button>
      <b-link to="register">Sign Up</b-link>
    </b-form>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      usernameError: 'Username does not exists',
      passwordError: 'Password incorrect',
      usernameState: null,
      passwordState: null
    }
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault()
      this.passwordState = this.usernameState = null

      try {
        const res = await this.$axios.$post(
          'https://apitrello.herokuapp.com/users/login',
          this.form
        )
        if (res) {
          if (process.browser) {
            localStorage.setItem('authToken', res)
          }

          this.$nuxt.$router.replace({ path: '/' })
        }
      } catch (error) {
        switch (error.response.status) {
          case 204:
            this.usernameState = false
            break
          case 401:
            this.passwordState = false
            break
          default:
            alert(error)
            break
        }
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
