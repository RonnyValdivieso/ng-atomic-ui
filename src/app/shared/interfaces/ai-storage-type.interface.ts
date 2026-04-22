export interface AIStorageTypeParameter {
  key: string;
  value: string;
  type: string;
  label: string;
  description: string;
}

export interface AIStorageType {
  code: string;
  name: string;
  description?: string;
  parameters?: string;
}

export type CreateAIStorageTypeDto = AIStorageType;

export type UpdateAIStorageTypeDto = Partial<Omit<AIStorageType, 'code'>>;
