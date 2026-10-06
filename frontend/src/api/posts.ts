import { api } from './client'

export type Post = {
  id: string
  circleId: string
  author: string
  content: string
  createdAt: string
}

export type PostsResponse = {
  posts: Post[]
}

export function listPosts(circleId: string) {
  return api<PostsResponse>(`/circles/${circleId}/posts`)
}

export function createPost(circleId: string, content: string) {
  return api<Post>(`/circles/${circleId}/posts`, {
    method: 'POST',
    body: { content },
  })
}
