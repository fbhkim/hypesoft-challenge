interface Window {
  keycloak?: {
    token?: string;
    updateToken?: (minValidity?: number) => Promise<boolean>;
  };
}
