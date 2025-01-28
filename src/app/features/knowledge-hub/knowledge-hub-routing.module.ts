import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeHubComponent } from './knowledge-hub.component';
import { KnowledgeLoungeComponent } from './pages/knowledge-lounge/knowledge-lounge.component';
import { ViewTemplateDetailsComponent } from './pages/view-template-details/view-template-details.component';

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
        path: 'view-template-details',
        component: ViewTemplateDetailsComponent,
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
