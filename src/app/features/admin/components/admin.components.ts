// src/app/features/admin/components/admin.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { User } from '../../auth/models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, TitleCasePipe],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Interface d'Administration</h1>
          <button
              (click)="addUser()" class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >Ajouter un utilisateur
        </button>
      </div>
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Gestion des Utilisateurs</h2>
        </div>

        <div class="p-6">
          @if (users().length > 0) {
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @for (user of users(); track user.id) {
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span class="text-sm font-medium text-gray-700">
                                {{ user.name.charAt(0).toUpperCase() }}
                              </span>
                            </div>
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                            <div class="text-sm text-gray-500">{{ user.email }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="">
                        <span
                          [class.bg-red-100]="user.role === 'admin'"
                          [class.text-white-800]="user.role === 'admin'"
                          [class.bg-green-100]="user.role === 'user'"
                          [class.text-green-800]="user.role === 'user'"
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        >
                          {{ user.role | titlecase }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        @if (user.role !== 'admin') {
                          <button
                            (click)="deleteUser(user.id)"
                            class="text-red-600 hover:text-red-900"
                          >
                            Supprimer
                          </button>
                        } @else {
                          <span class="text-gray-400">Admin</span>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          } @else {
            <p class="text-gray-500 text-center py-8">Aucun utilisateur trouvé</p>
          }
        </div>
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
