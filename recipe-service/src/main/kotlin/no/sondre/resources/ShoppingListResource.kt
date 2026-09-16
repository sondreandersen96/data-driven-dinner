package no.sondre.resources

import jakarta.inject.Inject
import jakarta.ws.rs.POST
import jakarta.ws.rs.Path
import no.sondre.domain.RecipeIngredient
import no.sondre.domain.ShoppingList
import no.sondre.services.ShoppingListService
import java.util.*

class RecipeSizeDto(val recipeId: UUID, val portions: Int)

class NewShoppingListDto(
    val name: String,
    val items: List<RecipeIngredient>,
    val recipes: List<RecipeSizeDto>,
)

@Path("/shopping-list")
class ShoppingListResource {

    @Inject
    lateinit var service: ShoppingListService

    @POST
    fun new(dto: NewShoppingListDto): ShoppingList {
        return service.new(
            name = dto.name,
            items = dto.items,
            recipes = dto.recipes.map { Pair(it.recipeId, it.portions) }
        )
    }
}