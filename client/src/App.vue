<script setup>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <Navbar />
  <main class="container min-vh-main py-5">
    <router-view :key="$route.fullPath" />
  </main>
  <Footer />
</template>
