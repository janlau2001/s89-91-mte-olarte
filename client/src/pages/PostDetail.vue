<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { request } from '../services/api'
import { auth } from '../store/auth'
import { formatDate, readingTime, initial } from '../utils'

const route = useRoute()
const router = useRouter()
const post = ref(null)
const error = ref('')
const loading = ref(true)
const confirming = ref(false)
const deleting = ref(false)

const isAuthor = computed(() => !!post.value && auth.user?.id === post.value.author?._id)
const canDelete = computed(() => isAuthor.value || auth.user?.isAdmin)

onMounted(async () => {
  try {
    post.value = await request(`/posts/getPost/${route.params.id}`)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

async function remove() {
  deleting.value = true
  try {
    await request(`/posts/deletePost/${post.value._id}`, 'DELETE')
    router.push('/posts')
  } catch (e) {
    error.value = e.message
    confirming.value = false
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="article">
    <router-link to="/posts" class="small text-muted text-decoration-none">&larr; All posts</router-link>

    <div v-if="loading" class="mt-4">
      <div class="skeleton mb-3" style="height: 44px; width: 80%"></div>
      <div class="skeleton mb-4" style="height: 18px; width: 40%"></div>
      <div class="skeleton mb-2" style="height: 18px"></div>
      <div class="skeleton mb-2" style="height: 18px"></div>
      <div class="skeleton" style="height: 18px; width: 70%"></div>
    </div>

    <div v-else-if="error && !post" class="text-center py-5">
      <p class="serif fs-3 mb-2">We couldn't open that post.</p>
      <p class="text-muted">{{ error }}</p>
      <router-link to="/posts" class="btn btn-line btn-sm">Back to posts</router-link>
    </div>

    <article v-else-if="post" class="mt-4">
      <h1 class="mb-3">{{ post.title }}</h1>
      <div class="meta mb-5 pb-4 border-bottom">
        <span class="avatar">{{ initial(post.author?.username) }}</span>
        <span>{{ post.author?.username || 'Unknown' }}</span>
        <span class="dot">{{ formatDate(post.createdAt) }}</span>
        <span class="dot">{{ readingTime(post.content) }}</span>
      </div>

      <div class="article-body mb-5">{{ post.content }}</div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div v-if="canDelete" class="border-top pt-4">
        <div v-if="!confirming" class="d-flex gap-2">
          <router-link v-if="isAuthor" :to="`/posts/${post._id}/edit`" class="btn btn-line btn-sm">Edit</router-link>
          <button class="btn btn-danger-line btn-sm" @click="confirming = true">Delete</button>
        </div>
        <div v-else class="d-flex align-items-center gap-2 flex-wrap">
          <span class="small me-2">Delete this post for good?</span>
          <button class="btn btn-line btn-sm" :disabled="deleting" @click="confirming = false">Keep it</button>
          <button class="btn btn-danger-line btn-sm" :disabled="deleting" @click="remove">
            {{ deleting ? 'Deleting…' : 'Yes, delete' }}
          </button>
        </div>
        <p v-if="auth.user?.isAdmin && !isAuthor" class="eyebrow mt-3 mb-0">Deleting as admin</p>
      </div>
    </article>
  </div>
</template>
