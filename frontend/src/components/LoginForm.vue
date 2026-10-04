<script setup lang="ts">
import { ref } from 'vue'
import { login, logout, me } from '@/api/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const currentEmail = ref('')
const pending = ref(false)

async function onSubmit() {
  error.value = ''
  success.value = ''
  pending.value = true

  try {
    const result = await login({
      email: email.value,
      password: password.value,
    })
    const session = await me()
    currentEmail.value = session.email
    success.value = result.message
  } catch (err) {
    currentEmail.value = ''
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    pending.value = false
  }
}

async function onLogout() {
  error.value = ''
  success.value = ''
  pending.value = true

  try {
    const result = await logout()
    currentEmail.value = ''
    success.value = result.message
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Logout failed'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="login-form" @submit.prevent="onSubmit">
    <div class="field">
      <label for="login-email">Email</label>
      <input
        id="login-email"
        v-model="email"
        type="email"
        name="email"
        autocomplete="username"
        required
      />
    </div>

    <div class="field">
      <label for="login-password">Password</label>
      <input
        id="login-password"
        v-model="password"
        type="password"
        name="password"
        autocomplete="current-password"
        required
      />
    </div>

    <button type="submit" :disabled="pending">
      {{ pending ? 'Signing in…' : 'Sign in' }}
    </button>

    <p v-if="currentEmail" class="success" role="status">Signed in as {{ currentEmail }}</p>
    <p v-else-if="success" class="success" role="status">{{ success }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <button v-if="currentEmail" type="button" :disabled="pending" @click="onLogout">
      Sign out
    </button>
  </form>
</template>

<style scoped>
.login-form {
  display: grid;
  gap: 1rem;
  max-width: 22rem;
}

.field {
  display: grid;
  gap: 0.35rem;
}

label {
  font-weight: 600;
}

input {
  padding: 0.5rem 0.6rem;
  font: inherit;
}

button {
  justify-self: start;
  padding: 0.5rem 0.9rem;
  font: inherit;
  cursor: pointer;
}

button:disabled {
  cursor: wait;
}

.success {
  color: #0a7a32;
}

.error {
  color: #b42318;
}
</style>
