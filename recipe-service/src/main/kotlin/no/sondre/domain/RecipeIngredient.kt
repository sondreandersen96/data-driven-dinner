package no.sondre.domain

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.IdClass
import java.util.*


@Entity
@IdClass(RecipeIngredientId::class)
class RecipeIngredient(

    val amount: Int,
    val unit: String, // TODO: make enum

    @Id
    var recipe: UUID? = null,
    @Id
    val ingredient: UUID
) {
    fun populate(recipe: UUID?) {
        this.recipe = recipe
    }
}
