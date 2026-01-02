interface Recipe {
  id: string | null
  name: string | null
  youtube: string | null
  ingredientsSections: Record<string, RecipeIngredient[]>
  description: string
  portions: number | null
  draft: boolean
  thumbnailUrl: string | null
}
