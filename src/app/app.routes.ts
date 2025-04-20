import { Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/landing/landing.module').then((m) => m.LandingModule),
  },
  // {
  //   path: 'knowledge',
  //   loadChildren: () =>
  //     import('./features/knowledge-hub/knowledge-hub.module').then(
  //       (m) => m.KnowledgeHubModule
  //     ),
  // },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },

  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: 'ai-agents',
    loadChildren: () =>
      import('./features/ai-agents/ai-agents.module').then(
        (m) => m.AiAgentsModule
      ),
    canActivate: [AuthGuard],
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
