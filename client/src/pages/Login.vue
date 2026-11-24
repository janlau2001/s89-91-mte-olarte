<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { request } from '../services/api'
import { auth } from '../store/auth'

const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const { access } = await request('/users/login', 'POST', { email: email.value, password: password.value })
    auth.login(access)
    router.push(route.query.redirect || '/posts')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <h1 class="mb-1">Welcome back</h1>
    <p class="text-muted mb-4">Log in to write and manage your posts.</p>
    <div v-if="route.query.registered" class="alert alert-success">Account created. You can log in now.</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input id="email" v-model="email" type="email" class="form-control" autocomplete="email" required>
      </div>
      <div class="mb-4">
        <label class="form-label" for="password">Password</label>
        <input id="password" v-model="password" type="password" class="form-control" autocomplete="current-password" required>
      </div>
      <button class="btn btn-ink w-100" :disabled="loading">{{ loading ? 'Logging in…' : 'Log in' }}</button>
    </form>
    <p class="small text-muted mt-4">New here? <router-link to="/register">Create an account</router-link></p>
  </div>
</template>
