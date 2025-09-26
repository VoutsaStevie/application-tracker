// src/app/features/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { AdminComponent } from './components/admin.components';
import { authGuard } from '../../core/guards/auth.guard';
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [authGuard]
  }
];