import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { recipeServiceUrl } from "@/globals.ts";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";

export const Route = createFileRoute('/ingredients/')({
  component: RouteComponent,
})

function RouteComponent() {
  const {isPending, error, data} = useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: async (): Promise<Ingredient[]> => {
      return recipeServiceClient(`${recipeServiceUrl}/ingredient`)
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
