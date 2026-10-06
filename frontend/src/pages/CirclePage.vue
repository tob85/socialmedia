<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getCircle, type Circle } from '@/api/circles'
import { createPost, listPosts, type Post } from '@/api/posts'

const route = useRoute()
const circleId = computed(() => String(route.params.id ?? ''))

const circle = ref<Circle | null>(null)
const posts = ref<Post[]>([])
const content = ref('')
const error = ref('')
const pending = ref(false)
const posting = ref(false)

async function load() {
  error.value = ''
  pending.value = true
  try {
    const [circleResult, postsResult] = await Promise.all([
      getCircle(circleId.value),
      listPosts(circleId.value),
    ])
    circle.value = circleResult
    posts.value = postsResult.posts
  } catch (err) {
    circle.value = null
    posts.value = []
    error.value = err instanceof Error ? err.message : 'Could not load circle'
  } finally {
    pending.value = false
  }
}

async function onSubmit() {
  error.value = ''
  posting.value = true
  try {
    const post = await createPost(circleId.value, content.value)
    posts.value = [post, ...posts.value]
    content.value = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Could not create post'
  } finally {
    posting.value = false
  }
}

watch(circleId, () => {
  void load()
}, { immediate: true })
</script>

<template>
  <section>
    <p v-if="pending">Loading circle…</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <template v-if="circle">
      <h1>{{ circle.name }}</h1>
      <p>{{ circle.visibility }} · {{ circle.role }}</p>

      <form class="post-form" @submit.prevent="onSubmit">
        <label for="post-content">Post</label>
        <textarea
          id="post-content"
          v-model="content"
          name="content"
          rows="3"
          required
        ></textarea>
        <button type="submit" :disabled="posting">
          {{ posting ? 'Posting…' : 'Post' }}
        </button>
      </form>

      <h2>Feed</h2>
      <p v-if="!posts.length">No posts yet.</p>
      <ul v-else class="post-list">
        <li v-for="post in posts" :key="post.id" :data-post-content="post.content">
          <p class="post-content">{{ post.content }}</p>
          <p class="meta">{{ post.author }}</p>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.post-form {
  display: grid;
  gap: 0.5rem;
  margin: 1.25rem 0 1.75rem;
}

.post-form button {
  justify-self: start;
}

h2 {
  margin: 0 0 0.75rem;
  font-size: 1.15rem;
  color: var(--green-700);
}

.post-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.post-list li {
  padding: 0.9rem 1rem;
  border: 1px solid var(--green-200);
  border-radius: 0.9rem;
  background: var(--green-50);
}

.post-content {
  margin: 0 0 0.35rem;
  color: var(--ink);
}

.meta {
  margin: 0;
  font-size: 0.9rem;
}
</style>
