// src/app/features/applications/components/application-list.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { applicationService } from '../services/application.service';
import { application } from '../models/application.model';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-3">
      <input
        type="text"
        [(ngModel)]="searchTerm"
        placeholder="Rechercher..."
        class="w-full md:w-1/3 px-3 py-2 border rounded-md"
      />
      <div class="flex gap-3">
        <button
          (click)="openModal()"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Ajouter
        </button>
        <button
          (click)="exportApplications()"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Exporter
        </button>
      </div>
    </div>
    <div
      *ngIf="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 class="text-lg font-semibold mb-4">Nouvelle candidature</h2>

        <input
          type="text"
          [(ngModel)]="newapplicationTitle"
          placeholder="Entreprise"
          class="w-full px-3 py-2 mb-3 border rounded-md"
        />
        <input
          type="text"
          [(ngModel)]="newapplicationDescription"
          placeholder="Poste"
          class="w-full px-3 py-2 mb-3 border rounded-md"
        />

        <div class="flex justify-end gap-2">
          <button
            (click)="closeModal()"
            class="px-3 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            (click)="onAddapplication(); closeModal()"
            class="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-y-auto"
           (dragover)="onDragOver($event)" (drop)="onDrop($event, 'application')">
        <span class="text-sm text-gray-500">({{ 
            applicationService.pendingapplications().length + 
            applicationService.inProgressapplications().length + 
            applicationService.completedapplications().length }})
        </span>

        <h3 class="text-lg font-semibold text-gray-900 mb-4">Candidatures envoyées</h3>
        <div class="space-y-3">
          @for (application of filterApplications(applicationService.pendingapplications()); track application.id) {
            <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-400 flex justify-between items-start"
                 draggable="true"
                 (dragstart)="onDragStart($event, application)"
                 (dragend)="onDragEnd($event)"
            >
              <div>
                <h4 class="font-medium text-gray-900">{{ application.title }}</h4>
                <p *ngIf="application.description" class="text-sm text-gray-600 mb-3">{{ application.description }}</p>
              </div>
              <button (click)="onDeleteapplication(application)" class="ml-2 text-red-600 hover:text-red-800">🗑️</button>
            </div>
          }
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-y-auto"
           (dragover)="onDragOver($event)" (drop)="onDrop($event, 'in-progress')">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Entretiens</h3>
        <div class="space-y-3">
          @for (application of filterApplications(applicationService.inProgressapplications()); track application.id) {
            <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-black-600 flex justify-between items-start"
                 draggable="true"
                 (dragstart)="onDragStart($event, application)"
                 (dragend)="onDragEnd($event)">
              <div>
                <h4 class="font-medium text-gray-900">{{ application.title }}</h4>
                <p *ngIf="application.description" class="text-sm text-gray-600 mb-3">{{ application.description }}</p>
              </div>
              <button (click)="onDeleteapplication(application)" class="ml-2 text-red-600 hover:text-red-800">🗑️</button>
            </div>
          }
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-y-auto"
           (dragover)="onDragOver($event)" (drop)="onDrop($event, 'done')">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Verdict</h3>
        <div class="space-y-3">
          @for (application of filterApplications(applicationService.completedapplications()); track application.id) {
            <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400 flex justify-between items-start"
                 draggable="true"
                 (dragstart)="onDragStart($event, application)"
                 (dragend)="onDragEnd($event)">
              <div>
                <h4 class="font-medium text-gray-900">{{ application.title }}</h4>
                <p *ngIf="application.description" class="text-sm text-gray-600 mb-3">{{ application.description }}</p>
              </div>
              <button (click)="onDeleteapplication(application)" class="ml-2 text-red-600 hover:text-red-800">🗑️</button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class applicationListComponent {
  applicationService = inject(applicationService);

  searchTerm = '';
  showModal = false;

  newapplicationTitle = '';
  newapplicationDescription = '';
  newapplicationPriority: 'low' | 'medium' | 'high' = 'medium';

  draggedapplication: application | null = null;

  openModal() { this.showModal = true; }
  closeModal() { this.showModal = false; }

  async onAddapplication() {
    if (!this.newapplicationTitle.trim()) return;
    await this.applicationService.createapplication({
      title: this.newapplicationTitle,
      description: this.newapplicationDescription,
      priority: this.newapplicationPriority,
    });
    this.newapplicationTitle = '';
    this.newapplicationDescription = '';
    this.newapplicationPriority = 'medium';
  }

  filterApplications(applications: application[]) {
    if (!this.searchTerm.trim()) return applications;
    return applications.filter(app =>
      app.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (app.description?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  onDragStart(event: DragEvent, application: application) {
    this.draggedapplication = application;
    event.dataTransfer?.setData('text/plain', application.id.toString());
  }
  onDragEnd(event: DragEvent) { this.draggedapplication = null; }

  async onDrop(event: DragEvent, newStatus: application['status']) {
    event.preventDefault();
    if (!this.draggedapplication) return;
    await this.applicationService.updateapplication(this.draggedapplication.id, { status: newStatus });
    this.draggedapplication = null;
  }
  onDragOver(event: DragEvent) { event.preventDefault(); }

  async onDeleteapplication(application: application) {
    if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      await this.applicationService.deleteapplication(application.id);
    }
  }

    async exportApplications() {
    const allApplications = [
      ...this.applicationService.pendingapplications(),
      ...this.applicationService.inProgressapplications(),
      ...this.applicationService.completedapplications(),
    ];

    const header = ['Entreprise', 'Poste', 'Contrat'];
    const rows = allApplications.map(app => [
      `"${app.title}"`,
      `"${app.description || ''}"`,
      app.priority,
    ]);

    const csvContent = [header, ...rows]
      .map(row => row.join(';'))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

}
