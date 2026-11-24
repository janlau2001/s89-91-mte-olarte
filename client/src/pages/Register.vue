<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { request } from '../services/api'

const router = useRouter()
const email = ref('')
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters.'
    return
  }
  loading.value = true
  try {
    await request('/users/register', 'POST', {
      email: email.value,
      username: username.value,
      password: password.value,
    })
    router.push({ path: '/login', query: { registered: '1' } })
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <h1 class="mb-1">Start writing</h1>
    <p class="text-muted mb-4">Create an account in a few seconds.</p>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input id="email" v-model="email" type="email" class="form-control" autocomplete="email" required>
      </div>
      <div class="mb-3">
        <label class="form-label" for="username">Username</label>
        <input id="username" v-model="username" class="form-control" minlength="3" autocomplete="username" required>
      </div>
      <div class="mb-4">
        <label class="form-label" for="password">Password</label>
        <input id="password" v-model="password" type="password" class="form-control" minlength="8" autocomplete="new-password" required>
        <div class="form-text">At least 8 characters.</div>
      </div>
      <button class="btn btn-ink w-100" :disabled="loading">{{ loading ? 'Creating…' : 'Create account' }}</button>
    </form>
    <p class="small text-muted mt-4">Already have an account? <router-link to="/login">Log in</router-link></p>
  </div>
</template>
