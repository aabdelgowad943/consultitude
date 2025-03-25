import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateAiConsultantComponent } from '../../components/create-ai-consultant/create-ai-consultant.component';
import { Profile } from '../../../dashboard/models/profile';
import { AuthService } from '../../../auth/services/auth.service';
import { EditAiConsultantComponent } from '../../components/edit-ai-consultant/edit-ai-consultant.component';
import { AgentsService } from '../../../dashboard/services/agents.service';

@Component({
  selector: 'app-agents',
  imports: [
    CommonModule,
    RouterModule,
    CreateAiConsultantComponent,
    EditAiConsultantComponent,
  ],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
})
export class AgentsComponent implements OnInit {
  constructor(private agentService: AgentsService) {}
  profileId: string = localStorage.getItem('profileId') || '';

  allAgents: any = [];
  myAgents: any = [];
  myFeaturedAgents: any = [];

  displayEditDialog: boolean = false;
  displayEditConsultantDialog: boolean = false;
  selectedAgent: any = null;

  ngOnInit(): void {
    this.getAllAgents();
  }

  openDialog() {
    this.displayEditDialog = true;
  }

  getAllAgents() {
    this.agentService.getAllAgents(1, 100).subscribe({
      next: (res: any) => {
        // All agents for Consultitude section
        this.allAgents = res.data;

        // Agents created by the current user
        this.myAgents = res.data.filter(
          (agent: any) => agent.profileId === this.profileId
        );

        // First 10 of the user's agents
        this.myFeaturedAgents = this.myAgents.slice(0, 10);

        console.log('All agents', this.allAgents);
        console.log('My agents', this.myAgents);
      },
      error: (err) => {
        console.error('Error fetching agents', err);
      },
    });
  }

  onDisplayChange(value: boolean) {
    this.displayEditDialog = value;
  }

  onAgentChange(event: any) {
    this.getAllAgents();
    console.log('Agent change event', event);
  }

  onEditDisplayChange(value: boolean) {
    this.displayEditConsultantDialog = value;
  }

  openDropdownIndex: number | null = null;

  toggleDropdown(index: number, event: Event): void {
    event.stopPropagation();
    this.openDropdownIndex = this.openDropdownIndex === index ? null : index;
  }

  editAgent(agent: any): void {
    this.selectedAgent = agent;
    console.log('selected agent to edit', this.selectedAgent);

    this.displayEditConsultantDialog = true;
    this.openDropdownIndex = null;
  }

  toggleActivation(agent: any, event: Event): void {
    event.stopPropagation(); // Prevent dropdown from closing
    agent.isActive = !agent.isActive;

    this.agentService.toggleStatus(agent.id, agent).subscribe({
      next: (res: any) => {
        this.getAllAgents();
      },
    });
  }

  closeDropdown(event: Event): void {
    event.stopPropagation();
    this.openDropdownIndex = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Check if click is outside of any dropdown
    const dropdowns = document.querySelectorAll('.agent-dropdown');
    let clickedInside = false;

    dropdowns.forEach((dropdown) => {
      if (dropdown.contains(event.target as Node)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) {
      this.openDropdownIndex = null;
    }
  }
}
