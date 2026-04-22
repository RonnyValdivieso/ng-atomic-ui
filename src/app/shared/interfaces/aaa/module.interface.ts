export interface UserModule {
  id: string;
  name: string;
  status?: string | null;
  permissions?: string[];
}
