import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeHubComponent } from './knowledge-hub.component';
import { KnowledgeLoungeComponent } from './pages/knowledge-lounge/knowledge-lounge.component';
import { ViewTemplateDetailsComponent } from './pages/view-template-details/view-template-details.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AuthGuard } from '../../guard/auth.guard';

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
        path: 'view-template-details/:id',
        component: ViewTemplateDetailsComponent,
      },
      {
        path: 'checkout/:id',
        component: CheckoutComponent,
        canActivate: [AuthGuard],
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
