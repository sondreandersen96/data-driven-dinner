package no.sondre.resources

import jakarta.inject.Inject
import jakarta.ws.rs.*
import no.sondre.services.RecipeService
import no.sondre.domain.Recipe
import java.util.*

@Path("recipe")
class RecipeResource {

    @Inject
    lateinit var service: RecipeService

    @GET
    fun list(): List<Recipe> {
        return service.list()
    }

    @GET
    @Path("{id}")
    fun load(@PathParam("id") id: UUID): Recipe {
        return service.load(id)
    }

    @POST
    fun save(recipe: Recipe): Recipe {
        return service.new(recipe)
    }

    @PUT
    @Path("{id}")
    fun update(@PathParam("id") id: UUID, recipe: Recipe): Recipe {
        recipe.assertId(id)
        return service.update(recipe)
    }
}
