import { Environment } from './environment.type';

export const environment: Environment = {
  production: false,
  apiUrl: 'https://api-stg.brandbot.ch/api',
  authUrl: 'https://auth-stg.brandbot.ch/api',
  defaultInstanceId: '00000000-0000-0000-0000-000000000000',
  google: {
    clientId: '736197905669-69clqjduv9bbf65gnpd2ujembe62hlrl.apps.googleusercontent.com'
  },
  microsoft: {
    clientId: 'e1fa426f-bbd2-4c1c-8203-277d7921767b',
    tenantId: '9edf92ee-68bb-4ddf-9490-945d3db5fb84'
  }
};
