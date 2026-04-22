export interface Instance {
  id: string;
  name: string;
  domain?: string | null;
  description?: string | null;
  defaultLanguage?: string | null;
  defaultCurrency?: string | null;
  status?: string | null;
  timeZoneReference?: string | null;
  picture?: string | null;
  organizationId?: string | null;
  serviceTeamId?: string | null;
}
