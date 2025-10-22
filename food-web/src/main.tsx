import ReactDOM from 'react-dom/client'
import {RouterProvider, createRouter} from '@tanstack/react-router'
import {routeTree} from './routeTree.gen'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

// Set up a Router instance
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
})

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

import "./index.css"
import Keycloak from "keycloak-js";

const rootElement = document.getElementById('app')!

const queryClient = new QueryClient()

if (!rootElement.innerHTML) {
    const env = import.meta.env.MODE

    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    )
}
