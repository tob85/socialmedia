import { api } from './client'

export type RegisterRequest = {
  email: string
  password: string
}

export type RegisterResponse = {
  message: string
}

export function register(body: RegisterRequest) {
  return api<RegisterResponse>('/auth/register', {
    method: 'POST',
    body,
  })
}

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  message: string
}

export function login(body: LoginRequest) {
  return api<LoginResponse>('/auth/login', {
    method: 'POST',
    body,
  })
}

export type MeResponse = {
  email: string
}

export function me() {
  return api<MeResponse>('/auth/me')
}

export function logout() {
  return api<{ message: string }>('/auth/logout', {
    method: 'POST',
  })
}
