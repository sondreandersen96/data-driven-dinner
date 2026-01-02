import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import RecipeList from "@/routes/recipes/-components/RecipeList/RecipeList.tsx";
// @ts-ignore
import styles from "./index.module.css"

export const Route = createFileRoute('/')({
  component: Recipes,
})

function Recipes() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAiMode, setIsAiMode] = useState(false)
  const [showDrafts, setShowDrafts] = useState(false)

  return (
    <>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Våre favoritter<br />samlet på ett sted
        </h1>
        <p className={styles.heroDescription}>
          Finn raskt de oppskriftene familien elsker. Legg til nye favoritter eller søk etter noe spesifikt.
        </p>

        <div className={styles.searchContainer}>
          <div className={styles.searchModeToggle}>
            <span className={`${styles.toggleLabel} ${!isAiMode ? styles.toggleLabelActive : ''}`}>
              Søk
            </span>
            <div
              className={`${styles.toggleSwitch} ${isAiMode ? styles.toggleSwitchAi : ''}`}
              onClick={() => setIsAiMode(!isAiMode)}
            >
              <div className={styles.toggleSlider} />
            </div>
            <span className={`${styles.toggleLabel} ${isAiMode ? styles.toggleLabelActive : ''}`}>
              Spør AI ✨
            </span>
          </div>

          <div className={`${styles.searchWrapper} ${isAiMode ? styles.searchWrapperAi : ''}`}>
            {isAiMode && <span className={styles.aiIcon}>✨</span>}
            <input
              type="text"
              className={`${styles.searchInput} ${isAiMode ? styles.searchInputAi : ''}`}
              placeholder={isAiMode
                ? "Spør meg om oppskrifter, ingredienser eller matlaging..."
                : "Søk etter oppskrifter eller ingredienser..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className={`${styles.searchButton} ${isAiMode ? styles.searchButtonAi : ''}`}>
              {isAiMode ? 'Spør AI' : 'Søk'}
            </button>
          </div>
        </div>
      </section>

      <div className={styles.contentWrapper}>
        <div className={styles.filterBar}>
          <div className={styles.draftToggle}>
            <span className={`${styles.filterLabel} ${!showDrafts ? styles.filterLabelActive : ''}`}>
              Publiserte
            </span>
            <div
              className={`${styles.filterSwitch} ${showDrafts ? styles.filterSwitchDraft : ''}`}
              onClick={() => setShowDrafts(!showDrafts)}
            >
              <div className={styles.filterSlider} />
            </div>
            <span className={`${styles.filterLabel} ${showDrafts ? styles.filterLabelActive : ''}`}>
              Utkast
            </span>
          </div>
        </div>
        <RecipeList searchQuery={searchQuery} isAiSearch={isAiMode} showDrafts={showDrafts} />
      </div>
    </>
  )
}
