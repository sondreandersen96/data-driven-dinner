import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
// @ts-ignore
import styles from './root.module.css'
import NewRecipe from "@/components/NewRecipe/NewRecipe.tsx";
import { useState } from "react";

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const [newRecipeModalOpen, setNewRecipeModalOpen] = useState(false)

  const closeNewRecipeModal = () => {
    setNewRecipeModalOpen(false)
  }

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navPill}>
          <Link
            to="/"
            className={styles.navLink}
            activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
            activeOptions={{ exact: true }}
          >
            🍔&nbsp; Oppskrifter
          </Link>
          <Link
            to="/inspiration"
            className={styles.navLink}
            activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
          >
            💡&nbsp; Inspirasjon
          </Link>
          <Link
            to="/ingredients"
            className={styles.navLink}
            activeProps={{ className: `${styles.navLink} ${styles.navLinkActive}` }}
          >
            🥦&nbsp; Ingredienser
          </Link>
        </nav>
        <button
          className={styles.addRecipeButton}
          onClick={() => setNewRecipeModalOpen(true)}
        >
          + Ny oppskrift
        </button>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <NewRecipe isOpen={newRecipeModalOpen} closeNewRecipeModal={closeNewRecipeModal} />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}
