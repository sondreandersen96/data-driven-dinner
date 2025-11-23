package no.sondre.resources

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.inject.Inject
import jakarta.ws.rs.*
import no.sondre.domain.Ingredient
import no.sondre.services.IngredientService
import java.util.*

@Path("ingredient")
class IngredientResource {
    @Inject lateinit var objectMapper: ObjectMapper
//
//    @ServerExceptionMapper
//    fun mapException(e: Exception): RestResponse<String> {
//        // TODO: all exceptions are now mapped to not found, this should not be the case
//        val map = mapOf("message" to e.message)
//        val json = objectMapper.writer().withDefaultPrettyPrinter().writeValueAsString(map)
//        return RestResponse.status(Response.Status.INTERNAL_SERVER_ERROR, json)
//    }

    @Inject
    lateinit var service: IngredientService

    @GET
    fun list(@QueryParam("nameQuary") nameQuery: String?): List<Ingredient> {
        return service.list(nameQuery)
    }

    @GET
    @Path("{id}")
    fun load(@PathParam("id") id: UUID): Ingredient {
        return service.load(id)
    }

    @POST
    fun save(ingredient: Ingredient): Ingredient {
        return service.save(ingredient)
    }

    @PUT
    @Path("{id}")
    fun update(@PathParam("id") id: UUID, ingredient: Ingredient): Ingredient {
        if (id != ingredient.idSafe()) {
            throw BadRequestException("Object with id: ${ingredient.id} cannot update resource with id: $id")
        }
        return service.update(ingredient)
    }
}
