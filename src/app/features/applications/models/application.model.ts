export interface application {
  id: number;
  title: string;
  description: string;
  status: 'application' | 'in-progress' | 'done';
  priority: 'job' | 'stage' | 'high';
  assignedTo?: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateapplicationRequest {
  title: string;
  description: string;
  priority: 'job' | 'stage' | 'high';
  assignedTo?: number;
}