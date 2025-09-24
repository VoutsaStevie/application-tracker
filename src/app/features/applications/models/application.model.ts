export interface application {
  id: number;
  title: string;
  description: string;
  status: 'application' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: number; // ID de l'utilisateur assigné
  createdBy: number;   // ID de l'utilisateur créateur
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateapplicationRequest {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: number;
}