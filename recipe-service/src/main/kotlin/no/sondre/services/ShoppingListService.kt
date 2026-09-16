package no.sondre.services

import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import no.sondre.domain.RecipeIngredient
import no.sondre.domain.ShoppingList
import java.util.*

@ApplicationScoped
class ShoppingListService {

    @Inject
    private lateinit var recipeService: RecipeService

    fun new(name: String, items: List<RecipeIngredient>, recipes: List<Pair<UUID, Int>>): ShoppingList {
        val ingredientsFromRecipes = recipes
            .map { recipeService.load(it.first, it.second) }
            .flatMap { it.allRecipeIngredients() }

        val shoppingList = ShoppingList(
            name = name,
            items = ingredientsFromRecipes + items,
        )

        // persist


        return shoppingList
    }
}