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
          import('./modules/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
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
        path: 'insights',
        loadComponent: () =>
          import('./modules/insights/insights.component').then(
            (c) => c.InsightsComponent
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
