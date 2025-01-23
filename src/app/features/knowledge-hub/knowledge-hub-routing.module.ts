import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeHubComponent } from './knowledge-hub.component';
import { KnowledgeLoungeComponent } from './pages/knowledge-lounge/knowledge-lounge.component';
import path from 'path';

const routes: Routes = [
  {
    path: '',
    component: KnowledgeHubComponent,
    children: [
      {
        path: 'lounge',
        component: KnowledgeLoungeComponent,
      },
      {
        path: '',
        redirectTo: 'lounge',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowledgeHubRoutingModule {}
