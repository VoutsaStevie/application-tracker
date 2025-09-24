// src/app/features/applications/components/application-list.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { applicationService } from '../services/application.service';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { application } from '../models/application.model';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityPipe, HighlightDirective],
  template: `
    <!-- Formulaire d'ajout -->
    <div class="mb-6 p-4 bg-white rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Ajouter une tâche</h2>
      <form (ngSubmit)="onAddapplication()" #applicationForm="ngForm" class="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          [(ngModel)]="newapplicationTitle"
          name="title"
          required
          placeholder="Titre"
          class="flex-1 px-3 py-2 border rounded-md"
        />
        <input
          type="text"
          [(ngModel)]="newapplicationDescription"
          name="description"
          placeholder="Description"
          class="flex-1 px-3 py-2 border rounded-md"
        />
        <select
          [(ngModel)]="newapplicationPriority"
          name="priority"
          class="px-3 py-2 border rounded-md"
        >
          <option value="low">Alternance</option>
          <option value="medium">Stage</option>
          <option value="high">CDI</option>
        </select>
        <button
          type="submit"
          [disabled]="!applicationForm.form.valid"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Ajouter
        </button>
      </form>
    </div>

    <!-- Dashboard des statistiques -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Statistiques en temps réel</h2>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Envoyées</h3>
          <p class="text-2xl font-bold text-gray-900">{{ applicationService.applicationstats().total }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Réponses</h3>
          <p class="text-2xl font-bold text-black-600">{{ applicationService.applicationstats().completed }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Entretiens</h3>
          <p class="text-2xl font-bold text-black-600">{{ applicationService.applicationstats().inProgress }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h3 class="text-sm font-medium text-gray-500">Priorité haute</h3>
          <p class="text-2xl font-bold text-black-600">{{ applicationService.applicationstats().highPriority }}</p>
        </div>
      </div>
    </div>

    <!-- Colonnes Kanban -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-y-auto"
           (dragover)="onDragOver($event)" (drop)="onDrop($event, 'application')">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Candidatures envoyée
        </h3>
        <div class="space-y-3">
          @for (application of applicationService.pendingapplications(); track application.id) {
            <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-400 flex justify-between items-start"
                 draggable="true"
                 (dragstart)="onDragStart($event, application)"
                 (dragend)="onDragEnd($event)"
                 [appHighlight]="application.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'"
                 [appHighlightDelay]="application.priority === 'high' ? 500 : 0">
              <div>
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900">{{ application.title }}</h4>
                </div>
                @if (application.description) {
                  <p class="text-sm text-gray-600 mb-3">{{ application.description }}</p>
                }
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Créé le {{ application.createdAt | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
              <button (click)="onDeleteapplication(application)" class="ml-2 text-red-600 hover:text-red-800">
                🗑️
              </button>
            </div>
          }
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-y-auto"
           (dragover)="onDragOver($event)" (drop)="onDrop($event, 'in-progress')">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Entretiens
        </h3>
        <div class="space-y-3">
          @for (application of applicationService.inProgressapplications(); track application.id) {
            <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-black-600 flex justify-between items-start"
                 draggable="true"
                 (dragstart)="onDragStart($event, application)"
                 (dragend)="onDragEnd($event)"
                 [appHighlight]="application.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'"
                 [appHighlightDelay]="application.priority === 'high' ? 500 : 0">
              <div>
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900">{{ application.title }}</h4>
                </div>
                @if (application.description) {
                  <p class="text-sm text-gray-600 mb-3">{{ application.description }}</p>
                }
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Mis à jour le {{ application.updatedAt | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
              <!-- Icône corbeille -->
              <button (click)="onDeleteapplication(application)" class="ml-2 text-red-600 hover:text-red-800">
                🗑️
              </button>
            </div>
          }
        </div>
      </div>

      <div class="bg-gray-50 rounded-lg p-4 max-h-[600px] overflow-y-auto"
           (dragover)="onDragOver($event)" (drop)="onDrop($event, 'done')">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Verdict
        </h3>
        <div class="space-y-3">
          @for (application of applicationService.completedapplications(); track application.id) {
            <div class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400 flex justify-between items-start"
                 draggable="true"
                 (dragstart)="onDragStart($event, application)"
                 (dragend)="onDragEnd($event)"
                 [appHighlight]="application.priority === 'high' ? 'rgba(34, 197, 94, 0.1)' : 'transparent'"
                 [appHighlightDelay]="application.priority === 'high' ? 500 : 0">
              <div>
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900 line-through">{{ application.title }}</h4>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    [class.bg-red-100]="application.priority === 'high'"
                    [class.bg-yellow-100]="application.priority === 'medium'"
                    [class.bg-green-100]="application.priority === 'low'"
                  >
                    {{ application.priority | priority }}
                  </span>
                </div>
                @if (application.description) {
                  <p class="text-sm text-gray-600 mb-3 line-through">{{ application.description }}</p>
                }
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Terminé le {{ application.updatedAt | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
              <!-- Icône corbeille -->
              <button (click)="onDeleteapplication(application)" class="ml-2 text-red-600 hover:text-red-800">
                🗑️
              </button>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class applicationListComponent {
  applicationService = inject(applicationService);

  newapplicationTitle = '';
  newapplicationDescription = '';
  newapplicationPriority: 'low' | 'medium' | 'high' = 'medium';

  draggedapplication: application | null = null;

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

  onDragStart(event: DragEvent, application: application) {
    this.draggedapplication = application;
    event.dataTransfer?.setData('text/plain', application.id.toString());
  }

  onDragEnd(event: DragEvent) {
    this.draggedapplication = null;
  }

  async onDrop(event: DragEvent, newStatus: application['status']) {
    event.preventDefault();
    if (!this.draggedapplication) return;
    await this.applicationService.updateapplication(this.draggedapplication.id, { status: newStatus });
    this.draggedapplication = null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // 🔴 Nouvelle fonction pour supprimer une application
  async onDeleteapplication(application: application) {
    if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      await this.applicationService.deleteapplication(application.id);
    }
  }
}
