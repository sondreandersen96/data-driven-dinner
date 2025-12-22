// src/KeycloakProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import keycloak from './keycloak';

export interface KeyCloakContextInterface {
  initialized: boolean,
  authenticated: boolean,
  token: string | undefined
}

export const KeycloakContext = createContext<KeyCloakContextInterface>({
  initialized: false,
  authenticated: false,
  token: undefined
});

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({children}) => {
  const [auth, setAuth] = useState<KeyCloakContextInterface>({
    initialized: false,
    authenticated: false,
    token: "",
    // Add other relevant properties like 'refreshToken', 'idToken', etc.
  });

  // TODO: consider turning off auth when local development
  // if (env == 'development')

  useEffect(() => {
    let refreshInterval: ReturnType<typeof setInterval> | undefined;

    keycloak.init({
      onLoad: 'login-required',
      pkceMethod: 'S256',
    }).then(authenticated => {
      setAuth({
        initialized: true,
        authenticated: authenticated,
        token: keycloak.token,
      });

      if (authenticated) {
        // Refresh token when it's about to expire (30 seconds before)
        refreshInterval = setInterval(() => {
          keycloak.updateToken(30).then(refreshed => {
            if (refreshed) {
              setAuth(prev => ({ ...prev, token: keycloak.token }));
            }
          }).catch(() => {
            console.error('Failed to refresh token, logging in again');
            keycloak.login();
          });
        }, 10000); // Check every 10 seconds
      }
    }).catch(error => {
      console.error('Keycloak initialization failed:', error);
      setAuth({initialized: true, authenticated: false, token: undefined});
    });

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
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