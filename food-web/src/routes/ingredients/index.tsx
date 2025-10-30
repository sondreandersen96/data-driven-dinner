import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";
import { useKeycloak } from "@/keycloakProvider.tsx";

export const Route = createFileRoute('/ingredients/')({
  component: RouteComponent,
})

function RouteComponent() {

  const keycloak = useKeycloak()

  const {isPending, error, data} = useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: async (): Promise<Ingredient[]> => {
      return recipeServiceClient(`ingredient`, keycloak.token)
    },
  })

  if (isPending) return 'Loading'
  if (error) return 'An error has occured: ' + error.message
  return (
    <div>
      <h1>Ingredients</h1>
      {data.map((i) => (
          <div>
            {i.name}
          </div>
        )
      )}
    </div>
  )
}
