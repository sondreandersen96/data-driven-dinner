import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
// @ts-ignore
import styles from './root.module.css'
// @ts-ignore
import image from "@/assets/oppskrifter_logo.png"
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
      <div className={styles["logoContainer"]}>
        <img className={styles["logo"]} src={image}/>
        <h1>🥩🍔Oppskrifter🍕🥦</h1>
      </div>

      <div className={styles["header-row-container"]}>
        <div className={styles["leftItems"]}>
          <Link to="/">Oppskrifter</Link>{' '}
          <Link to="/inspiration">Inspirasjon</Link>{' '}
          <Link to="/ingredients">Ingredienser</Link>
        </div>
        <div className={styles["rightItems"]}>
          <button onClick={() => setNewRecipeModalOpen(true)}>Ny oppskrift</button>
        </div>
      </div>
      <NewRecipe isOpen={newRecipeModalOpen} closeNewRecipeModal={closeNewRecipeModal}/>
      <hr/>
      <Outlet/>
      <TanStackRouterDevtools position="bottom-right"/>
    </>
  )
}
