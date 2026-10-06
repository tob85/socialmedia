import { api } from './client'

export type CircleRole = 'owner' | 'member'

export type Circle = {
  id: string
  name: string
  visibility: string
  role: CircleRole
}

export type CirclesResponse = {
  circles: Circle[]
}

export function listMyCircles() {
  return api<CirclesResponse>('/circles')
}

export function leaveCircle(circleId: string) {
  return api<{ message: string }>('/circles/leave', {
    method: 'POST',
    body: { circleId },
  })
}