package no.sondre.repository

import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.persistence.Embeddable
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.IdClass
import jakarta.persistence.Table
import jakarta.transaction.Transactional
import jakarta.ws.rs.NotFoundException
import no.sondre.domain.Ingredient
import no.sondre.domain.RecipeIngredient
import java.io.Serializable
import java.util.UUID

@Embeddable
class RecipeIngredientId(
    val recipe: UUID,
    val ingredient: UUID
) : Serializable {}

@Entity
@Table(name = "recipeingredient")
@IdClass(RecipeIngredientId::class)
class SQLRecipeIngredient(

    var amount: Int,
    var unit: String, // TODO: make enum

    @Id
    val recipe: UUID,
    @Id
    val ingredient: UUID
) : SQLModel<RecipeIngredient> {

    companion object : SQLModelCreator<RecipeIngredient, SQLRecipeIngredient> {
        override fun fromPOJO(pojo: RecipeIngredient): SQLRecipeIngredient {
            return SQLRecipeIngredient(
                amount = pojo.amount,
                unit = pojo.unit,
                recipe = pojo.recipe,
                ingredient = pojo.ingredient.idSafe()
            )
        }
    }

    override fun toPOJO(): RecipeIngredient {
        return RecipeIngredient(
            amount = amount,
            unit = unit,
            // repository will be responsible for fully initializing
            ingredient = Ingredient.uninitializedWithId(ingredient),
        ).apply { populate(recipe) }
    }

    override fun update(new: RecipeIngredient) {
        amount = new.amount
        unit = new.unit
    }

    fun compositeKey(): String {
        return "$recipe-$ingredient"
    }
}

@ApplicationScoped
@Transactional
class RecipeIngredientRepository : PanacheRepository<SQLRecipeIngredient> {

    fun load(recipe: UUID): List<SQLRecipeIngredient> {
        return find("recipe", recipe).list()
    }

    fun load(recipe: UUID, ingredient: UUID): SQLRecipeIngredient {
        return find(
            "recipe = :recipeId and ingredient = :ingredientId",
            mapOf(
                "recipeId" to recipe,
                "ingredientId" to ingredient
            )
        ).firstResult() ?: throw NotFoundException("Recipe Ingredient not found")
    }

    fun clear(ris: List<SQLRecipeIngredient>) {
        ris.forEach {
            val sql = load(recipe = it.recipe, ingredient = it.ingredient)
            delete(sql)
        }
    }

    fun delete(recipeIngredient: RecipeIngredient) {
        delete(
            "recipe = ?1 and ingredient = ?2",
            recipeIngredient.recipe,
            recipeIngredient.ingredient.id as Any
        )
    }
}

fun List<RecipeIngredient>.fromPOJOs(): MutableList<SQLRecipeIngredient> {
    return this.map { SQLRecipeIngredient.fromPOJO(it) }.toMutableList()
}
