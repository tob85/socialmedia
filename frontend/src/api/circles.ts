import { api } from './client'

export type CircleRole = 'owner' | 'member'

export type CircleSummary = {
  id: string
  name: string
  visibility: string
}

export type Circle = CircleSummary & {
  role: CircleRole
}

export type CirclesResponse = {
  circles: Circle[]
}

export type AvailableCirclesResponse = {
  circles: CircleSummary[]
}

export function listMyCircles() {
  return api<CirclesResponse>('/circles')
}

export function listAvailableCircles() {
  return api<AvailableCirclesResponse>('/circles/available')
}

export function getCircle(circleId: string) {
  return api<Circle>(`/circles/${circleId}`)
}

export function joinCircle(circleId: string) {
  return api<{ message: string }>('/circles/join', {
    method: 'POST',
    body: { circleId },
  })
}

export function leaveCircle(circleId: string) {
  return api<{ message: string }>('/circles/leave', {
    method: 'POST',
    body: { circleId },
  })
}
