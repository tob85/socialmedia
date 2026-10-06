import { handlers, type MockHandler } from './handlers'

export const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'

const delayMs = Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 200)

const pathPatterns: Array<{ key: string; regex: RegExp }> = [
  { key: '/circles/:id/posts', regex: /^\/circles\/([^/]+)\/posts$/ },
  { key: '/circles/:id', regex: /^\/circles\/([^/]+)$/ },
]

function resolveHandler(method: string, path: string): { handler: MockHandler; params: Record<string, string> } | null {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const exact = handlers[`${method} ${normalized}`]
  if (exact) {
    return { handler: exact, params: {} }
  }

  for (const pattern of pathPatterns) {
    const match = normalized.match(pattern.regex)
    const handler = handlers[`${method} ${pattern.key}`]
    if (match && handler) {
      return { handler, params: { id: match[1] ?? '' } }
    }
  }

  return null
}

export async function handleMock<T>(path: string, method: string, body?: unknown): Promise<T> {
  const key = `${method} ${path.startsWith('/') ? path : `/${path}`}`
  const resolved = resolveHandler(method, path)

  if (!resolved) {
    throw new Error(`No mock for ${key}. Add it in src/api/mock/handlers.ts`)
  }

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }

  const result = resolved.handler(body, resolved.params)
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
