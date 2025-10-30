import {createFileRoute} from '@tanstack/react-router'
import { useKeycloak } from "@/keycloakProvider.tsx";

export const Route = createFileRoute('/')({
    component: HomeComponent,
})

function HomeComponent() {
  const { authenticated } = useKeycloak()
  console.log("authenticated: ", authenticated)
    return (
        <div className="p-2">
            <h3>Welcome Home!</h3>
        </div>
    )
}
