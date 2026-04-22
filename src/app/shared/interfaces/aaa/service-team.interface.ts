export type ServiceTeamStatus = 'Active' | 'Inactive';

export interface ServiceTeam {
  id: string;
  name: string;
  status: ServiceTeamStatus;
}

export interface ServiceTeamDetail extends ServiceTeam {
  organizationCount: number;
  instanceCount: number;
}

export interface CreateServiceTeamRequest {
  name: string;
}

export interface UpdateServiceTeamRequest {
  name: string;
}

export interface UpdateServiceTeamStatusRequest {
  status: ServiceTeamStatus;
}
