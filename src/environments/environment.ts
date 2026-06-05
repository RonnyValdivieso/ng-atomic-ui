import { Environment } from './environment.type';
import { getRuntimeConfigValue } from './runtime-config';

export const environment: Environment = {
  production: false,
  apiUrl: getRuntimeConfigValue('API_URL', 'https://api-stg.brandbot.ch/api'),
  authUrl: getRuntimeConfigValue('AUTH_URL', 'https://auth-stg.brandbot.ch/api'),
  defaultInstanceId: getRuntimeConfigValue(
    'DEFAULT_INSTANCE_ID',
    '00000000-0000-0000-0000-000000000000'
  ),
  google: {
    clientId: getRuntimeConfigValue(
      'GOOGLE_CLIENT_ID',
      '736197905669-69clqjduv9bbf65gnpd2ujembe62hlrl.apps.googleusercontent.com'
    )
  },
  microsoft: {
    clientId: getRuntimeConfigValue('MICROSOFT_CLIENT_ID', 'e1fa426f-bbd2-4c1c-8203-277d7921767b'),
    tenantId: getRuntimeConfigValue('MICROSOFT_TENANT_ID', '9edf92ee-68bb-4ddf-9490-945d3db5fb84')
  }
};
