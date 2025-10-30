import { recipeServiceUrl } from "@/globals.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";

export async function recipeServiceClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const keyCloak = useKeycloak()

  console.log(`using token (${keyCloak.token}) to call recipe service`)

  const defaultHeaders = {
    'X-Requested-With': 'JavaScript',
    'Authorization': `Bearer ${keyCloak.token}`
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

  try {
    const url = `${recipeServiceUrl}/${endpoint}`
    console.log("API client is about to make request")
    const response = await fetch(url, config)
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