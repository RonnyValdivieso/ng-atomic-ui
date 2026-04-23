import { Environment } from './environment.type';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.brandbot.ch/api',
  authUrl: 'https://auth.brandbot.ch/api',
  defaultInstanceId: 'REPLACE_WITH_PROD_DEFAULT_INSTANCE_ID',
  google: {
    clientId: 'REPLACE_WITH_PROD_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
  },
  microsoft: {
    clientId: 'REPLACE_WITH_PROD_MS_CLIENT_ID',
    tenantId: 'REPLACE_WITH_PROD_MS_TENANT_GUID'
  }
};
