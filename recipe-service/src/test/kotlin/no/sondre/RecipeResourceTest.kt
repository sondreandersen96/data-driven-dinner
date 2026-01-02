package no.sondre

import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import jakarta.inject.Inject
import no.sondre.domain.Ingredient
import no.sondre.domain.Recipe
import no.sondre.domain.RecipeIngredient
import no.sondre.domain.unInitializedUUID
import no.sondre.repository.IngredientRepository
import no.sondre.repository.RecipeRepository
import org.apache.http.HttpStatus
import org.hamcrest.Matchers.`is`
import org.hamcrest.Matchers.notNullValue
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import kotlin.random.Random

@QuarkusTest
class RecipeResourceTest {

    @Inject
    lateinit var recipeRepository: RecipeRepository

    @Inject
    lateinit var recipeIngredientRepository: IngredientRepository

    @Inject
    lateinit var ingredientRepository: IngredientRepository

    val baseUrl = "/recipe"
    private val ingredients = listOf(
        Ingredient("ingredient one"),
        Ingredient("ingredient two"),
        Ingredient("ingredient three")
    )

    private final val recipe =
        Recipe(
            "recipe one",
            ingredientsSections = mutableMapOf("main" to listOf()),
            description = "beskrivelse",
            portions = 4
        )

    @BeforeEach
    fun setup() {
        recipeRepository.deleteAll()
        recipeIngredientRepository.deleteAll()
        ingredientRepository.deleteAll()
    }

    fun assureIngredientsExists() {
        val savedIngredients = given().contentType(ContentType.JSON)
            .`when`()
            .get("ingredient")
            .then()
            .statusCode(200)
            .extract()
            .`as`(Array<Ingredient>::class.java).toList()
        val missing = ingredients.filter { i ->
            i.name !in savedIngredients.map { it.name }
        }
        for (m in missing) {
            val saved = saveIngredient(m)
            m.id = saved.idSafe()
        }
    }

    fun saveIngredient(i: Ingredient): Ingredient {
        return given()
            .contentType(ContentType.JSON)
            .body(i)
            .`when`()
            .post("ingredient")
            .then()
            .statusCode(HttpStatus.SC_OK)
            .extract()
            .`as`(Ingredient::class.java)
    }

    fun listIngredients(): List<Ingredient> {
        val ingredients = given()
            .contentType(ContentType.JSON)
            .`when`()
            .get("ingredient")
            .then()
            .statusCode(HttpStatus.SC_OK)
            .extract().`as`(Array<Ingredient>::class.java).toList()
        return ingredients
    }

    fun listRecipes(): List<Recipe> {
        return given().contentType(ContentType.JSON)
            .`when`()
            .get(baseUrl)
            .then()
            .statusCode(200)
            .extract()
            .`as`(Array<Recipe>::class.java).toList()
    }

    @Test
    fun `can save recipe without ingredients`() {
        val response = given()
            .contentType(ContentType.JSON)
            .body(recipe)
            .`when`()
            .post(baseUrl)
            .then()
            .statusCode(HttpStatus.SC_OK)
            .body(
                "id", notNullValue(),
                "name", `is`(
                    recipe.name,
                )
            )
        // Deserialize example, not strictly needed here
        val respRecipe = response.extract().`as`(Recipe::class.java)
        assertEquals(respRecipe.name, recipe.name)
    }

    @Test
    fun `can save recipe with ingredients`() {
        assureIngredientsExists()
        val ingredients = listIngredients()

        ingredients.take(2).forEachIndexed { index, ingredient ->
            recipe.ingredientsSections["course + $index"] = listOf(
                RecipeIngredient(
                    amount = index + 10.0,
                    unit = "freedom unit ${Random.nextInt(0, 1000)}",
                    ingredient = ingredient,
                )
            )
        }

        val rawResponse = given()
            .contentType(ContentType.JSON)
            .body(recipe)
            .`when`()
            .post(baseUrl)
            .then()
            .statusCode(HttpStatus.SC_OK)
        val recipeResponse = rawResponse.extract().`as`(Recipe::class.java)
        assert(recipeResponse.name == recipe.name) { "name must be same as name of input object" }
        assert(recipeResponse.ingredientsSections.size == recipe.ingredientsSections.size) { "all saved ingredients must be retrieved" }
    }

    @Test
    fun `can list all recipes that does NOT have ingredients`() {
        `can save recipe without ingredients`()
        val responseRecipes = listRecipes()
        assert(responseRecipes.isNotEmpty()) { "There should be a least one saved recipe" }
    }

    @Test
    fun `can list all recipes that DOES have ingredients`() {
        `can save recipe with ingredients`()
        val responseRecipes = listRecipes()
        assert(responseRecipes.isNotEmpty()) { "Response should not be empty" }
        val firstResponseRecipe = responseRecipes.first()
        val responseRecipeIngredients = firstResponseRecipe.allRecipeIngredients().sortedBy { it.amount }
        assert(responseRecipeIngredients.first().amount == 10.0)
    }

    @Test
    fun `can update recipe`() {
        `can save recipe with ingredients`()
        val recipe = listRecipes()[0]
        val newName = "new name"
        recipe.name = newName
        recipe.ingredientsSections["main course"] = listOf(
            (
                    RecipeIngredient(
                        12345.9,
                        "freedomUnit2",
                        ingredients[2]
                    ))
        )

        val response = given()
            .contentType(ContentType.JSON)
            .body(recipe)
            .`when`()
            .put(baseUrl + "/${recipe.id}")
            .then()
            .statusCode(HttpStatus.SC_OK)

        val respRecipe = response.extract().`as`(Recipe::class.java)

        assertEquals(respRecipe.name, newName)

        val newIngredient = respRecipe.allRecipeIngredients().filter { it.amount == 12345.9 }
        assert(newIngredient.size == 1)
    }

    @Test
    fun `404 when trying to update non-existing recipe`() {

    }

    @Test
    fun `can delete recipe and corresponding recipe ingredients`() {
        `can save recipe with ingredients`()
        val recipe = listRecipes()[0]
        assert(recipe.ingredientsSections.isNotEmpty()) { "Recipe we are about to delete should have recipe ingredients to make sure we can delete them as well" }
        given()
            .contentType(ContentType.JSON)
            .`when`()
            .delete(baseUrl + "/${recipe.id}")
            .then()
            .statusCode(HttpStatus.SC_NO_CONTENT)
    }
}
