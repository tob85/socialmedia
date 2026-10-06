<script setup lang="ts">
import { ref } from 'vue'
import { register } from '@/api/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const pending = ref(false)

async function onSubmit() {
  error.value = ''
  success.value = ''
  pending.value = true

  try {
    const result = await register({
      email: email.value,
      password: password.value,
    })
    success.value = result.message
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Registration failed'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <form class="register-form" @submit.prevent="onSubmit">
    <div class="field">
      <label for="register-email">Email</label>
      <input
        id="register-email"
        v-model="email"
        type="email"
        name="email"
        autocomplete="email"
        required
      />
    </div>

    <div class="field">
      <label for="register-password">Password</label>
      <input
        id="register-password"
        v-model="password"
        type="password"
        name="password"
        autocomplete="new-password"
        required
      />
    </div>

    <button type="submit" :disabled="pending">
      {{ pending ? 'Creating account…' : 'Create account' }}
    </button>

    <p v-if="success" class="success" role="status">{{ success }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </form>
</template>

<style scoped>
.register-form {
  display: grid;
  gap: 1rem;
  max-width: 22rem;
  margin-top: 0.5rem;
}

.field {
  display: grid;
  gap: 0.35rem;
}

button {
  justify-self: start;
}
</style>
