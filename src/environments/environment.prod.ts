import { Environment } from './environment.type';
import { getRuntimeConfigValue } from './runtime-config';

export const environment: Environment = {
  production: true,
  apiUrl: getRuntimeConfigValue('API_URL', 'https://api.brandbot.ch/api'),
  authUrl: getRuntimeConfigValue('AUTH_URL', 'https://auth.brandbot.ch/api'),
  defaultInstanceId: getRuntimeConfigValue(
    'DEFAULT_INSTANCE_ID',
    'REPLACE_WITH_PROD_DEFAULT_INSTANCE_ID'
  ),
  google: {
    clientId: getRuntimeConfigValue(
      'GOOGLE_CLIENT_ID',
      'REPLACE_WITH_PROD_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
    )
  },
  microsoft: {
    clientId: getRuntimeConfigValue('MICROSOFT_CLIENT_ID', 'REPLACE_WITH_PROD_MS_CLIENT_ID'),
    tenantId: getRuntimeConfigValue('MICROSOFT_TENANT_ID', 'REPLACE_WITH_PROD_MS_TENANT_GUID')
  }
};
