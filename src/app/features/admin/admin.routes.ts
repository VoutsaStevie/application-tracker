// src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';

// The import needs to point to your existing file and the component it exports
import { AdminComponent } from './components/admin.components';
import { authGuard } from '../../core/guards/auth.guard';
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard] // Add any route guards if necessary
  }
];