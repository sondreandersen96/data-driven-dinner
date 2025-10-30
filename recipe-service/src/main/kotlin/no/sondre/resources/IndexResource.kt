package no.sondre.resources

import io.quarkus.security.identity.SecurityIdentity
import jakarta.inject.Inject
import jakarta.ws.rs.GET
import jakarta.ws.rs.Path

@Path("/")
class IndexResource {

    @Inject
    lateinit var identity: SecurityIdentity

    @GET
    fun index(): String {
        return "This is Recipe Service speaking (you are: ${identity.principal.name})"
    }
}
