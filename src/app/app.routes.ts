import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { LayoutComponent } from './modules/layout/layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },

      {
        path: 'overview',
        loadComponent: () =>
          import('./modules/overview/overview.component').then(
            (c) => c.OverviewComponent
          ),
      },

      {
        path: 'reports',
        loadComponent: () =>
          import('./modules/reports/reports.component').then(
            (c) => c.ReportsComponent
          ),
      },

      {
        path: 'contact',
        loadComponent: () =>
          import('./modules/contact/contact.component').then(
            (c) => c.ContactComponent
          ),
      },
    ],
  },
];
