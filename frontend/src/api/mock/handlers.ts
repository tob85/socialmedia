export type MockResult = {
  status: number
  body?: unknown
}

type MockUser = {
  email: string
  password: string
}

const users = new Map<string, MockUser>([
  ['ada@example.com', { email: 'ada@example.com', password: 'password1' }],
])

let currentEmail: string | null = null

let circles = [
  {
    id: 'circle-1',
    name: 'Weekend Hangouts',
    visibility: 'private',
    role: 'owner' as const,
  },
  {
    id: 'circle-2',
    name: 'Open Study Circle',
    visibility: 'public',
    role: 'member' as const,
  },
]

function asRecord(body: unknown) {
  return (body ?? {}) as Record<string, string>
}

export const handlers: Record<string, (body?: unknown) => MockResult> = {
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
    return { status: 200, body: { circles } }
  },

  'POST /circles/leave'(body) {
    const { circleId } = asRecord(body)
    const circle = circles.find((item) => item.id === circleId)
    if (!circle) {
      return { status: 404, body: { message: 'Circle not found' } }
    }
    if (circle.role === 'owner') {
      return { status: 400, body: { message: 'Owners cannot leave their circle' } }
    }
    circles = circles.filter((item) => item.id !== circleId)
    return { status: 200, body: { message: 'left circle' } }
  },
}
