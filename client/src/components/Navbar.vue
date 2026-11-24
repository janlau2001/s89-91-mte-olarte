<script setup>
import { useRouter } from 'vue-router'
import { auth } from '../store/auth'

const router = useRouter()

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <nav class="navbar navbar-expand site-nav sticky-top py-3">
    <div class="container">
      <router-link class="brand" to="/">Field<span>Notes</span></router-link>
      <div class="navbar-nav ms-auto flex-row align-items-center gap-1">
        <router-link class="nav-link" to="/posts">Read</router-link>
        <template v-if="auth.token">
          <router-link class="nav-link" to="/posts/new">Write</router-link>
          <span class="meta ms-2 me-2 d-none d-sm-flex">
            <span class="avatar">{{ auth.user?.username?.charAt(0).toUpperCase() }}</span>
            {{ auth.user?.username }}
            <span v-if="auth.user?.isAdmin" class="eyebrow">admin</span>
          </span>
          <button class="btn btn-line btn-sm" @click="logout">Log out</button>
        </template>
        <template v-else>
          <router-link class="nav-link" to="/login">Log in</router-link>
          <router-link class="btn btn-ink btn-sm ms-2" to="/register">Get started</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>
