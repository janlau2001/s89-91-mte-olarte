<script setup>
import { ref, computed, onMounted } from 'vue'
import { request } from '../services/api'
import { auth } from '../store/auth'
import PostRow from '../components/PostRow.vue'

const posts = ref([])
const error = ref('')
const loading = ref(true)
const query = ref('')
const mineOnly = ref(false)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return posts.value.filter(p => {
    if (mineOnly.value && p.author?._id !== auth.user?.id) return false
    return !q || p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
  })
})

onMounted(async () => {
  try {
    posts.value = (await request('/posts/getPosts')).posts
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div style="max-width: 760px; margin: 0 auto">
    <div class="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
      <div>
        <p class="eyebrow mb-1">Library</p>
        <h1 class="mb-0">All posts</h1>
      </div>
      <router-link v-if="auth.token" to="/posts/new" class="btn btn-ink btn-sm">Write a post</router-link>
    </div>

    <div class="d-flex gap-3 align-items-center mb-4 flex-wrap">
      <input v-model="query" class="form-control" style="max-width: 320px" placeholder="Search posts…" aria-label="Search posts">
      <div v-if="auth.token" class="form-check mb-0">
        <input id="mine" v-model="mineOnly" type="checkbox" class="form-check-input">
        <label for="mine" class="form-check-label small">Only my posts</label>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="loading">
      <div v-for="n in 4" :key="n" class="post-row">
        <div class="skeleton mb-2" style="height: 28px; width: 55%"></div>
        <div class="skeleton" style="height: 16px; width: 90%"></div>
      </div>
    </div>
    <div v-else-if="filtered.length" class="post-list">
      <PostRow v-for="post in filtered" :key="post._id" :post="post" />
    </div>
    <div v-else class="text-center py-5">
      <p class="serif fs-4 mb-1">{{ posts.length ? 'No matches.' : 'Nothing here yet.' }}</p>
      <p class="text-muted">{{ posts.length ? 'Try a different search.' : 'Be the first to publish something.' }}</p>
    </div>
  </div>
</template>
