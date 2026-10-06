<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { joinCircle, listAvailableCircles, type CircleSummary } from '@/api/circles'

const circles = ref<CircleSummary[]>([])
const error = ref('')
const pending = ref(false)

async function loadCircles() {
  error.value = ''
  pending.value = true
  try {
    const result = await listAvailableCircles()
    circles.value = result.circles
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not load circles'
  } finally {
    pending.value = false
  }
}

async function onJoin(circle: CircleSummary) {
  error.value = ''
  try {
    await joinCircle(circle.id)
    circles.value = circles.value.filter((item) => item.id !== circle.id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not join circle'
  }
}

onMounted(() => {
  void loadCircles()
})
</script>

<template>
  <section>
    <h1>Find Circles</h1>
    <p>Public groups you can join, and private groups that need an invite.</p>
    <p v-if="pending">Loading circles…</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-else-if="!pending && !circles.length">No circles to join right now.</p>

    <ul v-if="circles.length" class="circle-list">
      <li
        v-for="circle in circles"
        :key="circle.id"
        :class="{ private: circle.visibility === 'private' }"
        :data-circle-name="circle.name"
        :data-visibility="circle.visibility"
      >
        <div>
          <strong>{{ circle.name }}</strong>
          <span v-if="circle.visibility === 'private'" class="private-badge">Private</span>
          <p class="meta">{{ circle.visibility }}</p>
        </div>
        <button
          v-if="circle.visibility === 'public'"
          type="button"
          :aria-label="`Join ${circle.name}`"
          @click="onJoin(circle)"
        >
          Join
        </button>
        <p v-else class="invite">Invite only</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.circle-list li.private {
  background: var(--green-50);
}

.private-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: var(--green-100);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--green-700);
}

.invite {
  margin: 0;
  font-weight: 600;
  color: var(--muted);
}
</style>
