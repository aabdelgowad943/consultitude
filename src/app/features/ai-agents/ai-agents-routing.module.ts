import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AiAgentsComponent } from './ai-agents.component';
import { AgentsComponent } from './pages/agents/agents.component';

const routes: Routes = [
  {
    path: '',
    component: AiAgentsComponent,
    children: [
      {
        path: 'agents',
        component: AgentsComponent,
      },
      {
        path: '',
        redirectTo: 'agents',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AiAgentsRoutingModule {}
