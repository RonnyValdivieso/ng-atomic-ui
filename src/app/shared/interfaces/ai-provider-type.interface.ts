export interface AIProviderType {
  code: string;
  name: string;
  description?: string;
}

export type CreateAIProviderTypeDto = AIProviderType;

export type UpdateAIProviderTypeDto = Partial<Omit<AIProviderType, 'code'>>;
