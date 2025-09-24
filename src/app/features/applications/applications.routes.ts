import { Routes } from '@angular/router';
import { applicationListComponent } from './components/application-list.component';

export const applications_ROUTES: Routes = [
  {
    path: '',
    component: applicationListComponent
  }
];