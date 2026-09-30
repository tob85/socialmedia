const apiUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = `${apiUrl}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    credentials: 'include',
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    throw new Error(await readError(response, `${options.method ?? 'GET'} ${path} failed: ${response.status}`))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

async function readError(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { message?: string; errors?: string[] }
    if (payload.errors?.length) {
      return payload.errors.join(' ')
    }
    if (payload.message) {
      return payload.message
    }
  } catch {
    // Use the status fallback when the body is not JSON.
  }

  return fallback
}
