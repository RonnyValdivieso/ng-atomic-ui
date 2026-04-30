/**
 * NotificationTemplate row as returned by GET /v1/NotificationTemplates.
 * Asset / type / language values are server-driven strings; we don't pin
 * them as enums to stay tolerant of new values.
 */
export interface NotificationTemplate {
  id: string;
  userId?: string | null;
  instanceId: string;
  asset: string;
  type: string;
  name: string;
  code?: string | null;
  language: string;
  template: string;
}

export type NotificationTemplateDetail = NotificationTemplate;

export interface CreateNotificationTemplateRequest {
  asset: string;
  type: string;
  name: string;
  code?: string | null;
  language: string;
  template: string;
}

export interface UpdateNotificationTemplateRequest {
  asset?: string;
  type?: string;
  name?: string;
  code?: string | null;
  language?: string;
  template?: string;
}
