// src/app/features/auth/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  public readonly currentUser$ = this.currentUser.asReadonly();

  // Mock data - utilisateurs de test
  private defaultUsers: User[] = [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin'
    },
    {
      id: 2,
      name: 'Normal User',
      email: 'user@example.com',
      role: 'user'
    }
  ];

  // Mock data - mots de passe (en réalité, ils seraient hashés)
  private defaultPasswords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123'
  };

  private users: User[] = [];
  private passwords: Record<string, string> = {};

  constructor() {

    this.loadUsersFromStorage();

    // Vérifier s'il y a un utilisateur en session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find(u => u.email === credentials.email);
    const password = this.passwords[credentials.email];

    if (user && password === credentials.password) {
      // Simuler un délai réseau
      //this.setCurrentUser(user); // Set the current user after successful login
      return of(user).pipe(
        delay(500),
        tap(loggedInUser => this.setCurrentUser(loggedInUser))
      );
    } else {
      return throwError(() => new Error('Email ou mot de passe incorrect'));
    }
  }

  register(userData: RegisterRequest): Observable<User> {
    // Vérifier si l'email existe déjà
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return throwError(() => new Error('Cet email est déjà utilisé'));
    }

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: this.users.length + 1,
      name: userData.name,
      email: userData.email,
      role: 'user'
    };

    // Ajouter aux mock data
    this.users.push(newUser);
    this.passwords[userData.email] = userData.password;
    console.warn('Registered users before:', this.users);
    this.saveUsersToStorage();
    console.warn('Registered users after:', this.users);

    // Simuler un délai réseau
    this.setCurrentUser(newUser); // Set the current user after successful registration
    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isLoggedIn(): boolean {
    return !!this.currentUser();
  }

  // Cette méthode pourrait être utilisée par un guard ou un intercepteur
  getToken(): string | null {
    const user = this.currentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  // Méthode pour définir l'utilisateur connecté (utilisée après login/register)
  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Méthode pour obtenir tous les utilisateurs (pour l'interface admin)
  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  // Méthode pour supprimer un utilisateur (pour l'interface admin)
  deleteUser(userId: number): Observable<void> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.users.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    return throwError(() => new Error('Utilisateur non trouvé'));
  }


  private saveUsersToStorage(): void {
    localStorage.setItem('users', JSON.stringify(this.users));
    localStorage.setItem('usersPasswords', JSON.stringify(this.passwords));
  }

  private loadUsersFromStorage(): void {
    const savedUsers = localStorage.getItem('users');
    const savedPasswords = localStorage.getItem('usersPasswords');

    if (savedUsers && savedPasswords) {
      this.users = JSON.parse(savedUsers);
      this.passwords = JSON.parse(savedPasswords);
    } else{
      // Si aucun utilisateur n'est sauvegardé, initialiser avec les utilisateurs par défaut
      this.users = [...this.defaultUsers];
      this.passwords = { ...this.defaultPasswords };
      this.saveUsersToStorage();
    }
  }

  private clearAllUsersData(): void {
    localStorage.removeItem('users');
    localStorage.removeItem('usersPasswords');
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    this.loadUsersFromStorage();
  }
}