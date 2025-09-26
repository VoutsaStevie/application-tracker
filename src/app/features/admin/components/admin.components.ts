// src/app/features/admin/components/admin.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          (click)="addUser()"
          class="px-4 py-2 bg-green-500 text-white font-medium rounded-lg shadow hover:bg-green-600 transition"
        >
          + Ajouter
        </button>
      </div>

      <div class="space-y-4">
        @if (users().length > 0) {
          @for (user of users(); track user.id) {
            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition">
              <div class="flex items-center gap-4">
                <div class="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold text-gray-700">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <div>
                  <div class="text-gray-900 font-medium">{{ user.name }}</div>
                  <div class="text-gray-500 text-sm">{{ user.email }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded-full text-xs font-medium text-white"
                      [ngClass]="{
                        'bg-blue-500': user.role === 'admin'  
                      }">
                  {{ user.role | titlecase }}
                </span>
                @if (user.role !== 'admin') {
                  <button
                    (click)="deleteUser(user.id)"
                    class="px-3 py-1 text-red-600 font-medium hover:text-red-800 transition"
                  >
                    Supprimer
                  </button>
                } @else {
                  <span class="text-gray-400 text-sm">—</span>
                }
              </div>
            </div>
          }
        } @else {
          <p class="text-gray-500 text-center py-12 italic">Aucun utilisateur pour le moment</p>
        }
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  users = signal<User[]>([]);

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      this.router.navigate(['/applications']);
      return;
    }
    this.loadUsers();
  }

  loadUsers() {
    try {
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      this.users.set(users);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  }

  deleteUser(userId: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]') as User[];
        const updatedUsers = users.filter((u: User) => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        this.users.set(updatedUsers);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  }

  addUser() {
    this.router.navigate(['/auth/register']);
  }
}
