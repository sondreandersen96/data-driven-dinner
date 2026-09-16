package no.sondre.resources

import io.quarkus.security.identity.SecurityIdentity
import jakarta.inject.Inject
import jakarta.ws.rs.*
import no.sondre.domain.Recipe
import no.sondre.services.RecipeService
import java.util.*

@Path("recipe")
class RecipeResource {

    @Inject
    lateinit var securityIdentity: SecurityIdentity

    @Inject
    lateinit var service: RecipeService

    @GET
    fun list(@QueryParam("query") query: String?, @QueryParam("draft") draft: Boolean?): List<Recipe> {
        return service.list(query ?: "", draft ?: false)
    }

    @GET
    @Path("{id}")
    fun load(@PathParam("id") id: UUID, @QueryParam("portions") portions: Int?): Recipe {
        return service.load(id, portions)
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

    @DELETE
    @Path("{id}")
    fun delete(@PathParam("id") id: UUID) {
        service.delete(id)
    }

}
