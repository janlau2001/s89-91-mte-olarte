<script setup>
import { formatDate, readingTime, excerpt, initial } from '../utils'

defineProps({ post: { type: Object, required: true } })
</script>

<template>
  <router-link :to="`/posts/${post._id}`" class="post-row">
    <h2>{{ post.title }}</h2>
    <p>{{ excerpt(post.content) }}</p>
    <div class="meta">
      <span class="avatar">{{ initial(post.author?.username) }}</span>
      <span>{{ post.author?.username || 'Unknown' }}</span>
      <span class="dot">{{ formatDate(post.createdAt) }}</span>
      <span class="dot">{{ readingTime(post.content) }}</span>
    </div>
  </router-link>
</template>
