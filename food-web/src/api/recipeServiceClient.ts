import { recipeServiceUrl } from "@/globals.ts";

export async function recipeServiceClientConfig(token: string | undefined, options: RequestInit = {}): Promise<RequestInit> {
  const defaultHeaders = {
    'X-Requested-With': 'JavaScript',
    'Authorization': `Bearer ${token}`
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...(options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : options.headers),
  };

  const config: RequestInit = {
    ...options,
    credentials: 'include',
    headers: mergedHeaders,
  }
  return config
}

const recipeServiceUrlFactory = (endpoint: string): string => {
  return `${recipeServiceUrl}/${endpoint}`
}

export async function recipeServiceClient<T>(endpoint: string, token: string | undefined, options: RequestInit = {}): Promise<T> {
  const config = await recipeServiceClientConfig(token, options)
  try {
    const response = await fetch(recipeServiceUrlFactory(endpoint), config)
    if (!response.ok) {
      console.log(`Backend response not OK (${response.status})`)
      // if (response.status === 499) {
      //   const currentPath = window.location.pathname + window.location.search;
      //   window.location.href = `/quarkus/oidc/login?rd=${encodeURIComponent(currentPath)}`;
      //   return new Promise<T>(() => {})
      // }
    }
    return await response.json()
  } catch (error) {
    console.log("API request failed: ", error)
    throw error
  }
}

export async function recipeServiceClientNoContent(endpoint: string, token: string | undefined, options: RequestInit = {}) {
  const config = await recipeServiceClientConfig(token, options)
  try {
    const response = await fetch(recipeServiceUrlFactory(endpoint), config)
    const isNoContent = response.status === 204
    if (!isNoContent) {
      console.log(`Backend response not NO CONTENT(${response.status})`)
    }
  } catch (error) {
    console.log("API request failed: ", error)
    throw error
  }
}
