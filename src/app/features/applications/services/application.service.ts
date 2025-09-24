import { Injectable, signal, computed } from '@angular/core';
import { CreateapplicationRequest, application } from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class applicationService {
  private currentUserId!: number;
  private applications = signal<application[]>([]);

  constructor() {
  const savedUserId = localStorage.getItem('currentUserId');
  if (savedUserId) {
    this.currentUserId = Number(savedUserId);
    // ⚡ Charger les applications de l'utilisateur directement
    this.applications.set(this.loadapplications(this.currentUserId));
  } else {
    // Optionnel : définir un utilisateur par défaut si aucun n'est connecté
    this.currentUserId = 1;
    this.applications.set(this.loadapplications(this.currentUserId));
  }
}

  // Définir l'utilisateur courant
  setCurrentUser(userId: number) {
    this.currentUserId = userId;
    localStorage.setItem('currentUserId', String(userId));
    this.applications.set(this.loadapplications(userId));
  }

  // Générer la clé unique pour chaque utilisateur
  private storageKey(userId: number) {
    return `applications_user_${userId}`;
  }

  // Charger les applications d'un utilisateur
  private loadapplications(userId: number): application[] {
    const saved = localStorage.getItem(this.storageKey(userId));
    return saved ? JSON.parse(saved) : [];
  }

  // Sauvegarder les applications de l'utilisateur courant
  private saveapplications() {
    if (!this.currentUserId) return;
    localStorage.setItem(this.storageKey(this.currentUserId), JSON.stringify(this.applications()));
  }

  // Computed properties
  public completedapplications = computed(() =>
    this.applications().filter(application => application.status === 'done')
  );

  public pendingapplications = computed(() =>
    this.applications().filter(application => application.status === 'application')
  );

  public inProgressapplications = computed(() =>
    this.applications().filter(application => application.status === 'in-progress')
  );

  public highPriorityapplications = computed(() =>
    this.applications().filter(application => application.priority === 'high')
  );

  public applicationstats = computed(() => ({
    total: this.applications().length,
    completed: this.completedapplications().length,
    inProgress: this.inProgressapplications().length,
    pending: this.pendingapplications().length,
    highPriority: this.highPriorityapplications().length,
    completionRate: this.applications().length > 0
      ? (this.completedapplications().length / this.applications().length) * 100
      : 0
  }));

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET
  async getAllapplications(): Promise<application[]> {
    await this.delay(100);
    return this.applications();
  }

  async getapplicationById(id: number): Promise<application | undefined> {
    await this.delay(50);
    return this.applications().find(t => t.id === id);
  }

  // POST
  async createapplication(applicationData: CreateapplicationRequest): Promise<application> {
    await this.delay(100);
    const newapplication: application = {
      id: Date.now(),
      title: applicationData.title,
      description: applicationData.description || '',
      status: 'application',
      priority: applicationData.priority,
      assignedTo: applicationData.assignedTo,
      createdBy: this.currentUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.applications.update(applications => [...applications, newapplication]);
    this.saveapplications();
    return newapplication;
  }

  // PUT
  async updateapplication(id: number, updates: Partial<application>): Promise<application | undefined> {
    await this.delay(50);
    let updatedapplication: application | undefined;
    this.applications.update(applications =>
      applications.map(application => {
        if (application.id === id) {
          updatedapplication = { ...application, ...updates, updatedAt: new Date() };
          return updatedapplication;
        }
        return application;
      })
    );
    this.saveapplications();
    return updatedapplication;
  }

  // DELETE
  async deleteapplication(id: number): Promise<boolean> {
    await this.delay(50);
    let deleted = false;
    this.applications.update(applications => {
      const filtered = applications.filter(application => application.id !== id);
      deleted = filtered.length < applications.length;
      return filtered;
    });
    this.saveapplications();
    return deleted;
  }

  // Filtres utils
  getapplicationsByStatus(status: application['status']): application[] {
    return this.applications().filter(application => application.status === status);
  }

  getapplicationsByPriority(priority: application['priority']): application[] {
    return this.applications().filter(application => application.priority === priority);
  }
}
