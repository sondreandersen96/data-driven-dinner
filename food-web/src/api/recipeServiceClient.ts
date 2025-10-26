import { recipeServiceUrl } from "@/globals.ts";

export async function recipeServiceClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    credentials: 'include'
  }

  try {
    const url = `${recipeServiceUrl}/${endpoint}`
    console.log("API client is about to make request")
    const response = await fetch(url, config)
    if (!response.ok) {
      console.log(`Backend response not OK (${response.status})`)

      if (response.status === 302) {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/quarkus/oidc/login?rd=${encodeURIComponent(currentPath)}`;
        return new Promise<T>(() => {})
      }
    }
    return await response.json()
  } catch (error) {
    console.log("API request failed: ", error)
    throw error
  }
}