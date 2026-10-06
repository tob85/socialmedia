export type MockResult = {
  status: number
  body?: unknown
}

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
}
