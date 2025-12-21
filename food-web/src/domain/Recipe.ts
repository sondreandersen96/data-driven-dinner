interface Recipe {
  id: string | null
  name: string | null
  youtube: string | null
  ingredients: RecipeIngredient[]
  description: string
}
