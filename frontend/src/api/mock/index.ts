import { handlers } from './handlers'

export const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

const delayMs = Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 200)

export async function handleMock<T>(path: string, method: string, body?: unknown): Promise<T> {
  const key = `${method} ${path.startsWith('/') ? path : `/${path}`}`
  const handler = handlers[key]

  if (!handler) {
    throw new Error(`No mock for ${key}. Add it in src/api/mock/handlers.ts`)
  }

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  const result = handler(body)
  console.info(`[mock] ${key}`, result.status)

  if (result.status >= 400) {
    const payload = result.body as { message?: string; errors?: string[] } | undefined
    if (payload?.errors?.length) {
      throw new Error(payload.errors.join(' '))
    }
    throw new Error(payload?.message ?? `${method} ${path} failed: ${result.status}`)
  }

  return result.body as T
}
