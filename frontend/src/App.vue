<script setup lang="ts"></script>

<template>
  <div class="app-shell">
    <header>
      <p class="brand">Activities for parents and kids</p>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/circles">My Circles</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  max-width: 52rem;
  margin: 0 auto;
  padding: 1.25rem 1rem 3rem;
}

header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem 1.15rem;
  background: var(--white);
  border: 1px solid var(--green-200);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.brand {
  margin: 0;
  font-weight: 800;
  color: var(--green-700);
}

nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

nav a {
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  text-decoration: none;
  color: var(--green-700);
}

nav a:hover,
nav a.router-link-active {
  background: var(--green-100);
}

main {
  padding: 1.5rem 1.25rem 1.75rem;
  background: var(--white);
  border: 1px solid var(--green-200);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

@media (max-width: 640px) {
  header {
    align-items: flex-start;
  }

  h1 {
    font-size: 1.6rem;
  }
}
</style>
