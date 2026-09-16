package no.sondre.domain

import jakarta.ws.rs.NotFoundException
import java.time.ZonedDateTime
import java.util.*

class ShoppingItem(val item: RecipeIngredient, var added: Boolean = false) : Domain() {

    companion object {
        fun fromRecipeIngredient(ri: RecipeIngredient): ShoppingItem {
            return ShoppingItem(ri, false)
        }
    }
    override fun copy(): Domain {
        TODO("Not yet implemented")
    }
}

open class ShoppingList(
    val name: String,
    items: List<RecipeIngredient>,
    val created: ZonedDateTime = now()
) : Domain() {

    val shoppingItems: List<ShoppingItem> = items.map { ShoppingItem.fromRecipeIngredient(it) }

    fun checkOffItem(shoppingItemId: UUID) {
        val itemToCheckOff =
            shoppingItems.find { it.id == shoppingItemId } ?: throw NotFoundException("Item not found in shopping list")
        itemToCheckOff.added = true
    }

    override fun copy(): Domain {
        TODO("Not yet implemented")
    }
}