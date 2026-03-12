const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not defined. Please set it in your .env file.")
  }
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
}

export const callAuthenticatedEndpoint = async (token: string, path: string, init: RequestInit = {}): Promise<Response> => {
  if (!token) {
    throw new Error("Missing authentication token")
  }

  const headers = new Headers(init.headers as HeadersInit)
  headers.set("Authorization", `Bearer ${token}`)

  const shouldSetJsonHeader = init.body && !(init.body instanceof FormData)
  if (shouldSetJsonHeader && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return fetch(`${getApiBaseUrl()}${path}`, { ...init, headers })
}

export { getApiBaseUrl }
