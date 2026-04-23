export interface Environment {
  production: boolean;
  apiUrl: string;
  authUrl: string;
  defaultInstanceId: string;
  google: {
    clientId: string;
  };
  microsoft: {
    clientId: string;
    tenantId: string;
  };
}
