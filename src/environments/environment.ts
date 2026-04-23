import { Environment } from './environment.type';

export const environment: Environment = {
  production: false,
  apiUrl: 'https://api-stg.brandbot.ch/api',
  authUrl: 'https://auth-stg.brandbot.ch/api',
  defaultInstanceId: '00000000-0000-0000-0000-000000000000',
  google: {
    clientId: 'REPLACE_WITH_STG_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
  },
  microsoft: {
    clientId: 'REPLACE_WITH_STG_MS_CLIENT_ID',
    tenantId: 'REPLACE_WITH_STG_MS_TENANT_GUID'
  }
};
