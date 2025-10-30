import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: 'https://keycloak.sondreandersen.dev',
  realm: 'data-driven-dinner',
  clientId: 'food-web',
}

const keycloak = new Keycloak(keycloakConfig)

export default keycloak
