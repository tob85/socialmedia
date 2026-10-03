<script setup lang="ts"></script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
</style>
