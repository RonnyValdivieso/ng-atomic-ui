export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface Workspace {
  id: string;
  name: string;
  projects: Project[];
}
