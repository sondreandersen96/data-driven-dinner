import { createFileRoute } from '@tanstack/react-router'
import { useKeycloak } from "@/keycloakProvider.tsx";
import { useQuery } from "@tanstack/react-query";
import { recipeServiceClient } from "@/api/recipeServiceClient.ts";

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const {authenticated, token} = useKeycloak()
  console.log("authenticated: ", authenticated)


  const {isPending, error, data} = useQuery<string>({
    queryKey: ['ingredients'],
    queryFn: async (): Promise<string> => {
      return recipeServiceClient(``, token)
    },
  })

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
      <div>
        Test data:
        {!isPending &&
          data
        }
      </div>
    </div>
  )
}
