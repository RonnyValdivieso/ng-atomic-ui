export interface LoginDto {
  email: string;
  password: string;
  app?: string | null;
  appType?: string | null;
  instanceId?: string | null;
}

export interface UserDto {
  accessToken: string;
  email: string;
  firstName: string;
  lastName: string;
  defaultLanguage: string;
  instances: InstanceDetailDto[];
}

export interface InstanceDetailDto {
  id: string;
  name: string;
  // Add other fields as needed based on Swagger
}
