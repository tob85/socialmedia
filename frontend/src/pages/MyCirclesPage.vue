<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { leaveCircle, listMyCircles, type Circle } from '@/api/circles'

const circles = ref<Circle[]>([])
const error = ref('')
const pending = ref(false)

async function loadCircles() {
  error.value = ''
  pending.value = true
  try {
    const result = await listMyCircles()
    circles.value = result.circles
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not load circles'
  } finally {
    pending.value = false
  }
}

async function onLeave(circle: Circle) {
  error.value = ''
  try {
    await leaveCircle(circle.id)
    circles.value = circles.value.filter((item) => item.id !== circle.id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not leave circle'
  }
}

onMounted(() => {
  void loadCircles()
})
</script>

<template>
  <section>
    <h1>My Circles</h1>
    <p>Your groups for family activities, playdates, and local meetups.</p>
    <p v-if="pending">Loading circles…</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <ul v-if="circles.length" class="circle-list">
      <li
        v-for="circle in circles"
        :key="circle.id"
        :class="{ owner: circle.role === 'owner' }"
        :data-circle-name="circle.name"
        :data-role="circle.role"
      >
        <div>
          <RouterLink class="circle-name" :to="`/circles/${circle.id}`">{{ circle.name }}</RouterLink>
          <span v-if="circle.role === 'owner'" class="owner-badge">Owner</span>
          <p class="meta">{{ circle.visibility }} · {{ circle.role }}</p>
        </div>
        <button
          v-if="circle.role !== 'owner'"
          type="button"
          :aria-label="`Leave ${circle.name}`"
          @click="onLeave(circle)"
        >
          Leave
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.circle-name {
  font-weight: 700;
  text-decoration: none;
  color: var(--ink);
}

.circle-name:hover {
  color: var(--green-700);
  text-decoration: underline;
}

.circle-list li.owner {
  border-color: var(--green-400);
  background: var(--green-50);
}

.owner-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: var(--green-100);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--green-700);
}

button {
  background: var(--white);
  color: var(--green-700);
  border: 1px solid var(--green-400);
}

button:hover {
  background: var(--green-100);
  color: var(--green-700);
}
</style>
