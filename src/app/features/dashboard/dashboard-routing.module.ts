import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ViewDocumentDetailsComponent } from './pages/view-document-details/view-document-details.component';
import { AiAgentsComponent } from '../ai-agents/ai-agents.component';
import { AgentsComponent } from '../ai-agents/pages/agents/agents.component';
import { AskEvoComponent } from './pages/ask-evo/ask-evo.component';
import { ShowChatComponent } from './pages/show-chat/show-chat.component';
import { TalkToAiConsultantComponent } from './pages/talk-to-ai-consultant/talk-to-ai-consultant.component';
import { TalkToConsultantFromEvoHomeComponent } from './pages/talk-to-consultant-from-evo-home/talk-to-consultant-from-evo-home.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'ask-evo',
        component: AskEvoComponent,
      },
      {
        path: 'agents',
        component: AgentsComponent,
      },
      {
        path: 'view-chat-details/:id',
        component: ShowChatComponent,
      },

      {
        path: 'talk-to-ai-consultant',
        component: TalkToAiConsultantComponent,
      },

      {
        path: 'talk-to-agent',
        component: TalkToConsultantFromEvoHomeComponent,
      },

      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'view-document/:id',
    component: ViewDocumentDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
