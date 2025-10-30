// src/KeycloakProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import keycloak from './keycloak';

interface KeyCloakContext {
  initialized: boolean,
  authenticated: boolean,
  token: string | undefined
}

const KeycloakContext = createContext<KeyCloakContext>({
  initialized: false,
  authenticated: false,
  token: undefined
});

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({children}) => {
  const [auth, setAuth] = useState<KeyCloakContext>({
    initialized: false,
    authenticated: false,
    token: "",
    // Add other relevant properties like 'refreshToken', 'idToken', etc.
  });

  // TODO: consider turning off auth when local development
  // if (env == 'development')

  useEffect(() => {
    keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
    }).then(authenticated => {
      setAuth({
        initialized: true,
        authenticated: authenticated,
        token: keycloak.token,
      });
      console.log("Running keycloak useEffect...")
      // // Optional: Set up token refresh interval
      // if (authenticated) {
      //   setInterval(() => {
      //     keycloak.updateToken(70).then(refreshed => {
      //       if (refreshed) {
      //         console.log('Token successfully refreshed');
      //         setAuth(prev => ({ ...prev, token: keycloak.token }));
      //       } else {
      //         console.log('Token not refreshed, still valid');
      //       }
      //     }).catch(() => {
      //       console.error('Failed to refresh token. User may need to re-login.');
      //     });
      //   }, 60000); // Check every minute (adjust based on token lifespan)
      // }
    }).catch(error => {
      console.error('Keycloak initialization failed:', error);
      setAuth({initialized: true, authenticated: false, token: undefined});
    });
  }, []);

  // Provide keycloak instance methods for convenience
  const contextValue = {
    ...auth,
    keycloakInstance: keycloak,
    login: keycloak.login,
    logout: keycloak.logout,
  };

  if (!auth.initialized) {
    return (
      <div>Loading authentication...</div>
    )
  }

  return (
    <KeycloakContext.Provider value={contextValue}>
      {children}
    </KeycloakContext.Provider>
  );
};