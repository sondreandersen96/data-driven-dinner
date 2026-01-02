package no.sondre.repository

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import io.quarkus.hibernate.orm.panache.kotlin.PanacheRepository
import jakarta.enterprise.context.ApplicationScoped
import jakarta.inject.Inject
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.transaction.Transactional
import jakarta.ws.rs.NotFoundException
import no.sondre.domain.Recipe
import no.sondre.domain.RecipeIngredient
import org.hibernate.annotations.JdbcTypeCode
import org.hibernate.type.SqlTypes
import java.util.*


@Entity
@Table(name = "recipe")
class SQLRecipe(
    @Id
    val id: UUID,
    var name: String,
    var description: String,
    var youtube: String? = null,
    var portions: Int,
    @Column(name = "\"ingredientsSection\"", columnDefinition = "JSONB")
    @JdbcTypeCode(SqlTypes.JSON)
    var ingredientsSection: String, // actually {sectionName: [recipeIngredient...],...} # Where recipeIngredient only have ingredient pointer
    var draft: Boolean
) : SQLModel<Recipe> {

    companion object : SQLModelCreator<Recipe, SQLRecipe> {
        private val om = jacksonObjectMapper()
        override fun fromPOJO(pojo: Recipe): SQLRecipe {
            return SQLRecipe(
                id = pojo.idSafe(),
                name = pojo.name,
                youtube = pojo.youtube,
                description = pojo.description,
                portions = pojo.portions,
                ingredientsSection = serializeIngredientsSections(pojo.ingredientsSections),
                draft = pojo.draft
            )
        }

        fun serializeIngredientsSections(ingredientsSections: MutableMap<String, List<RecipeIngredient>>): String {
            val map = ingredientsSections.mapValues { (_, ingredients) ->
                ingredients.map { re ->
                    mapOf(
                        "amount" to re.amount,
                        "unit" to re.unit,
                        "ingredient" to re.ingredient.idSafe()
                    )
                }
            }
            return om.writeValueAsString(map)
        }
    }

    fun deserializeIngredientsSections(
        json: String,
        ingredientRepository: IngredientRepository
    ): MutableMap<String, List<RecipeIngredient>> {
        val map = om.readValue(json, jacksonTypeRef<Map<String, List<Map<String, String>>>>())
        val populatedMap: Map<String, List<RecipeIngredient>> = map.mapValues { (_, ingredients) ->
            ingredients.map { ingredientData ->
                RecipeIngredient(
                    ingredient = ingredientRepository.findById(UUID.fromString(ingredientData["ingredient"])),
                    amount = ingredientData["amount"]!!.toDouble(),
                    unit = ingredientData["unit"]!!
                )
            }
        }
        return populatedMap.toMutableMap()
    }

    override fun toPOJO(): Recipe {
        throw Exception("Use custom toPOJO instead")
    }

   fun toPOJO(ingredientRepository: IngredientRepository): Recipe {
        val pojo = Recipe(
            name,
            youtube,
            deserializeIngredientsSections(ingredientsSection, ingredientRepository),
            description,
            portions,
            draft
        )
        pojo.withId(id)
        return pojo
    }

    // Properties must be changed using a function so that Hibernate proxy will work
    // https://stackoverflow.com/questions/64503946/update-entity-data-using-quarkus-and-panacherepository-is-not-working
    // this is only fair code-wise, however if the entity extends PanacheEntity it will provide getters/setters behind the scene
    // TOOD: consider making all fields private to avoid such mistakes/bad pattern
    override fun update(new: Recipe) {
        name = new.name
        youtube = new.youtube
        description = new.description
        ingredientsSection = serializeIngredientsSections(new.ingredientsSections)
        draft = new.draft
    }
}


@ApplicationScoped
@Transactional
class RecipeRepository : PanacheRepository<SQLRecipe> {

    @Inject
    private lateinit var ingredientRepository: IngredientRepository

    fun all(query: String): List<Recipe> {
        val results = if (query.isBlank()) {
            listAll()
        } else {
            val searchInput = "%${query.lowercase()}%"
            list("LOWER(name) LIKE ?1", searchInput)
        }.map { it.toPOJO(ingredientRepository) }
        return results
    }

    private fun findSQLById(id: UUID): SQLRecipe {
        return find("id", id).firstResult() ?: throw NotFoundException("Recipe with ID $id not found")
    }

    fun findById(id: UUID): Recipe {
        return findSQLById(id).toPOJO(ingredientRepository)
    }

    fun new(recipe: Recipe) {
        persist(SQLRecipe.fromPOJO(recipe))
    }

    fun update(new: Recipe): Recipe {
        val current = findSQLById(new.idSafe())
        current.update(new)
        return current.toPOJO(ingredientRepository)
    }

    fun delete(recipe: Recipe) {
        delete(SQLRecipe.fromPOJO(recipe))
    }
}
