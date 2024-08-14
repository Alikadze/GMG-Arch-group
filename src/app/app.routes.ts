import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'auth',
        loadChildren: () => import('./pages/auth/auth.routes').then(m => m.AuthRoutes)
      },
      {
        path: 'project',
        loadChildren: () => import('./pages/project/project.routes').then(m => m.ProjectRoutes)
      },
      {
        path: 'about',
        component: AboutComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/'
  }
];
