package no.sondre.repository

import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.*
import jakarta.transaction.Transactional
import jakarta.ws.rs.InternalServerErrorException
import jakarta.ws.rs.NotFoundException
import no.sondre.domain.Recipe
import no.sondre.services.IngredientService
import java.util.*


@Entity
@Table(name = "recipe")
class SQLRecipe(
    @Id
    val id: UUID,
    var name: String,
    var description: String,
    var youtube: String? = null,
) : SQLModel<Recipe> {
    companion object : SQLModelCreator<Recipe, SQLRecipe> {
        override fun fromPOJO(pojo: Recipe): SQLRecipe {
            return SQLRecipe(
                id = pojo.idSafe(),
                name = pojo.name,
                youtube = pojo.youtube,
                description = pojo.description
            )
        }
    }

    override fun toPOJO(): Recipe {
        throw InternalServerErrorException("use custom method instead")
    }

    fun toPOJO(recipeIngredientRepo: RecipeIngredientRepository): Recipe {
        val recipeIngredients = recipeIngredientRepo.load(id).map { it.toPOJO() }.toMutableList()
        val pojo = Recipe(name, youtube, recipeIngredients, description)
        pojo.withId(id)
        return pojo
    }

    override fun update(new: Recipe) {
        name = new.name
        youtube = new.youtube
        description = new.description
    }
}


@ApplicationScoped
@Transactional
class RecipeRepository : PanacheRepository<SQLRecipe> {

    @Inject
    private lateinit var ingredientService: IngredientService

    @Inject
    private lateinit var recipeIngredientRepository: RecipeIngredientRepository

    fun all(): List<Recipe> {
        return listAll().map { it.toPOJO(recipeIngredientRepository) }
    }

    private fun findSQLByIdOrThrow(id: UUID): SQLRecipe {
        return find("id", id).firstResult() ?: throw NotFoundException("Recipe with ID $id not found")
    }

    fun findByIdOrThrow(id: UUID): Recipe {
        val r = findSQLByIdOrThrow(id).toPOJO(recipeIngredientRepository)
        val ingredientIds = r.ingredients.map { it.ingredient.idSafe() }
        val ingredients = ingredientService.load(ingredientIds)
        r.ingredients.forEach { recipeIngredient ->
            {
                val ingredient = ingredients.find { it.idSafe() == recipeIngredient.ingredient.idSafe() }
                    ?: throw InternalServerErrorException("Could not find ingredient")
                recipeIngredient.ingredient.populate(ingredient.name)
            }
        }
        return r
    }

    fun new(recipe: Recipe) {
        val recipeIngredients = recipe.ingredients
        recipeIngredients.forEach {
            recipeIngredientRepository.persist(SQLRecipeIngredient.fromPOJO(it))
        }
        persist(SQLRecipe.fromPOJO(recipe))
    }

    fun update(new: Recipe): Recipe {
        val current = findSQLByIdOrThrow(new.idSafe())
        updateRecipeIngredients(new.idSafe(), new.ingredients.fromPOJOs())
        current.update(new)
        return current.toPOJO(recipeIngredientRepository)
    }

    private fun updateRecipeIngredients(recipeId: UUID, new: List<SQLRecipeIngredient>) {
        val old = recipeIngredientRepository.load(recipeId)
        val oldKeys = old.map { it.compositeKey() }
        val newKeys = new.map { it.compositeKey() }
        val areNew = newKeys - oldKeys
        val shouldBeDeleted = oldKeys - newKeys
        val shouldBeUpdated = newKeys.intersect(oldKeys)

        shouldBeUpdated.forEach { oldKey ->
            val c = old.find { it.compositeKey() == oldKey }!!
            val n = new.find { it.compositeKey() == oldKey }!!
            c.update(n.toPOJO())
        }
        areNew.forEach { newKey ->
            val n = new.find { it.compositeKey() == newKey }!!
            recipeIngredientRepository.persist(n)
        }
        shouldBeDeleted.forEach { deleteKey ->
            val d = old.find { it.compositeKey() == deleteKey }!!
            recipeIngredientRepository.delete(d)
        }
    }
}
