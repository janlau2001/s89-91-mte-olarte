<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { request } from '../services/api'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const isEdit = computed(() => !!id)

const title = ref('')
const content = ref('')
const error = ref('')
const loading = ref(isEdit.value)
const saving = ref(false)

const wordCount = computed(() => content.value.trim().split(/\s+/).filter(Boolean).length)

onMounted(async () => {
  if (!isEdit.value) return
  try {
    const post = await request(`/posts/getPost/${id}`)
    title.value = post.title
    content.value = post.content
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

async function submit() {
  error.value = ''
  if (!title.value.trim() || !content.value.trim()) {
    error.value = 'Please add both a title and some content.'
    return
  }
  saving.value = true
  try {
    const body = { title: title.value.trim(), content: content.value }
    const result = isEdit.value
      ? await request(`/posts/updatePost/${id}`, 'PATCH', body)
      : await request('/posts/addPost', 'POST', body)
    router.push(`/posts/${id || result._id}`)
  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <form class="editor" @submit.prevent="submit">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <p class="eyebrow mb-0">{{ isEdit ? 'Editing' : 'New post' }}</p>
      <div class="d-flex gap-2">
        <router-link :to="isEdit ? `/posts/${id}` : '/posts'" class="btn btn-line btn-sm">Cancel</router-link>
        <button class="btn btn-ink btn-sm" :disabled="saving || loading">
          {{ saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish' }}
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-if="loading" class="skeleton" style="height: 220px"></div>
    <template v-else>
      <input v-model="title" class="form-control title-input" placeholder="Title" maxlength="120" aria-label="Title">
      <textarea v-model="content" class="form-control body-input" rows="14" placeholder="Start writing…" aria-label="Content"></textarea>
      <p class="small text-muted text-end mb-0">{{ wordCount }} {{ wordCount === 1 ? 'word' : 'words' }}</p>
    </template>
  </form>
</template>
