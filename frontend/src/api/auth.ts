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
