export type MockResult = {
  status: number
  body?: unknown
}

export type MockHandler = (body?: unknown, params?: Record<string, string>) => MockResult

type MockUser = {
  email: string
  password: string
}

type CircleRole = 'owner' | 'member'

type CatalogCircle = {
  id: string
  name: string
  visibility: 'public' | 'private'
}

type Membership = {
  circleId: string
  role: CircleRole
}

const users = new Map<string, MockUser>([
  ['ada@example.com', { email: 'ada@example.com', password: 'password1' }],
])

let currentEmail: string | null = null

const catalog: CatalogCircle[] = [
  { id: 'circle-1', name: 'Weekend Hangouts', visibility: 'private' },
  { id: 'circle-2', name: 'Open Study Circle', visibility: 'public' },
  { id: 'circle-3', name: 'Park Playdates', visibility: 'public' },
  { id: 'circle-4', name: 'Toddler Music Hour', visibility: 'public' },
  { id: 'circle-5', name: 'Family Reunion', visibility: 'private' },
]

let memberships: Membership[] = [
  { circleId: 'circle-1', role: 'owner' },
  { circleId: 'circle-2', role: 'member' },
]

type StoredPost = {
  id: string
  circleId: string
  author: string
  content: string
  createdAt: string
}

let postSeq = 2

let posts: StoredPost[] = [
  {
    id: 'post-1',
    circleId: 'circle-1',
    author: 'ada@example.com',
    content: 'Park meetup Saturday at 10?',
    createdAt: '2026-10-06T08:00:00.000Z',
  },
]

function asRecord(body: unknown) {
  return (body ?? {}) as Record<string, string>
}

function myCircles() {
  return memberships.flatMap((membership) => {
    const circle = catalog.find((item) => item.id === membership.circleId)
    if (!circle) {
      return []
    }
    return [{ ...circle, role: membership.role }]
  })
}

function availableCircles() {
  const memberIds = new Set(memberships.map((item) => item.circleId))
  return catalog.filter((circle) => !memberIds.has(circle.id))
}

function membershipFor(circleId: string) {
  return memberships.find((item) => item.circleId === circleId)
}

function circleWithRole(circleId: string) {
  const circle = catalog.find((item) => item.id === circleId)
  const membership = membershipFor(circleId)
  if (!circle || !membership) {
    return null
  }
  return { ...circle, role: membership.role }
}

export const handlers: Record<string, MockHandler> = {
  'POST /auth/register'(body) {
    const { email, password } = asRecord(body)
    if (!email || !password) {
      return { status: 400, body: { message: 'Email and password are required' } }
    }
    if (users.has(email)) {
      return { status: 400, body: { message: 'user not registered', errors: ['Email is already taken.'] } }
    }
    users.set(email, { email, password })
    return { status: 200, body: { message: 'user registered' } }
  },

  'POST /auth/login'(body) {
    const { email, password } = asRecord(body)
    if (!email || !password) {
      return { status: 400, body: { message: 'Email and password are required' } }
    }
    const user = users.get(email)
    if (!user || user.password !== password) {
      return { status: 401, body: { message: 'Invalid email or password' } }
    }
    currentEmail = email
    return { status: 200, body: { message: 'user logged in' } }
  },

  'GET /auth/me'() {
    if (!currentEmail) {
      return { status: 401, body: { message: 'Not logged in' } }
    }
    return { status: 200, body: { email: currentEmail } }
  },

  'POST /auth/logout'() {
    if (!currentEmail) {
      return { status: 401, body: { message: 'Not logged in' } }
    }
    currentEmail = null
    return { status: 200, body: { message: 'user logged out' } }
  },

  'GET /circles'() {
    return { status: 200, body: { circles: myCircles() } }
  },

  'GET /circles/available'() {
    return { status: 200, body: { circles: availableCircles() } }
  },

  'POST /circles/join'(body) {
    const { circleId } = asRecord(body)
    const circle = catalog.find((item) => item.id === circleId)
    if (!circle) {
      return { status: 404, body: { message: 'Circle not found' } }
    }
    if (memberships.some((item) => item.circleId === circleId)) {
      return { status: 400, body: { message: 'Already a member of this circle' } }
    }
    if (circle.visibility !== 'public') {
      return { status: 400, body: { message: 'Private circles cannot be joined directly' } }
    }
    memberships = [...memberships, { circleId: circle.id, role: 'member' }]
    return { status: 200, body: { message: 'joined circle' } }
  },

  'POST /circles/leave'(body) {
    const { circleId } = asRecord(body)
    const membership = memberships.find((item) => item.circleId === circleId)
    if (!membership) {
      return { status: 404, body: { message: 'Circle not found' } }
    }
    if (membership.role === 'owner') {
      return { status: 400, body: { message: 'Owners cannot leave their circle' } }
    }
    memberships = memberships.filter((item) => item.circleId !== circleId)
    return { status: 200, body: { message: 'left circle' } }
  },

  'GET /circles/:id'(_body, params) {
    const circle = circleWithRole(params?.id ?? '')
    if (!circle) {
      return { status: 404, body: { message: 'Circle not found' } }
    }
    return { status: 200, body: circle }
  },

  'GET /circles/:id/posts'(_body, params) {
    const circleId = params?.id ?? ''
    if (!membershipFor(circleId)) {
      return { status: 403, body: { message: 'Not a member of this circle' } }
    }
    const circlePosts = posts
      .filter((post) => post.circleId === circleId)
      .slice()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    return { status: 200, body: { posts: circlePosts } }
  },

  'POST /circles/:id/posts'(body, params) {
    const circleId = params?.id ?? ''
    if (!membershipFor(circleId)) {
      return { status: 403, body: { message: 'Not a member of this circle' } }
    }
    const { content } = asRecord(body)
    if (!content?.trim()) {
      return { status: 400, body: { message: 'Post content is required' } }
    }
    const post: StoredPost = {
      id: `post-${postSeq++}`,
      circleId,
      author: currentEmail ?? 'ada@example.com',
      content: content.trim(),
      createdAt: new Date().toISOString(),
    }
    posts = [post, ...posts]
    return { status: 200, body: post }
  },
}
