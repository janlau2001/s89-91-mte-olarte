<script setup>
import { ref, onMounted } from 'vue'
import { request } from '../services/api'
import { auth } from '../store/auth'
import PostRow from '../components/PostRow.vue'

const latest = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    latest.value = (await request('/posts/getPosts')).posts.slice(0, 3)
  } catch {
    latest.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="hero">
    <p class="eyebrow mb-3">A small corner of the internet</p>
    <h1 class="mb-4">Write down what you're <em>thinking.</em><br>Read what others are.</h1>
    <p class="lead-soft mb-4">
      Field Notes is a quiet, no-nonsense place for short essays, half-formed ideas and things
      you learned this week. No feeds to game. Just words.
    </p>
    <div class="d-flex gap-2 flex-wrap">
      <router-link v-if="auth.token" to="/posts/new" class="btn btn-ink">Write a post</router-link>
      <router-link v-else to="/register" class="btn btn-ink">Start writing</router-link>
      <router-link to="/posts" class="btn btn-line">Browse posts</router-link>
    </div>
  </section>

  <section class="row g-4 mb-5 pb-4">
    <div class="col-md-4">
      <div class="note-col">
        <h3>Write</h3>
        <p>Open the editor, type, publish. Title and text &mdash; that's all it asks for.</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="note-col">
        <h3>Read</h3>
        <p>Everything is public. Open any post without an account.</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="note-col">
        <h3>Keep control</h3>
        <p>Edit or delete your own posts any time. Your words stay yours.</p>
      </div>
    </div>
  </section>

  <section>
    <div class="d-flex justify-content-between align-items-baseline mb-3">
      <h2 class="h3 mb-0">Latest</h2>
      <router-link to="/posts" class="small">See all &rarr;</router-link>
    </div>
    <div v-if="loading" class="post-list">
      <div v-for="n in 3" :key="n" class="post-row">
        <div class="skeleton mb-2" style="height: 28px; width: 60%"></div>
        <div class="skeleton" style="height: 16px; width: 90%"></div>
      </div>
    </div>
    <div v-else-if="latest.length" class="post-list">
      <PostRow v-for="post in latest" :key="post._id" :post="post" />
    </div>
    <p v-else class="text-muted">Nothing published yet &mdash; be the first.</p>
  </section>
</template>
