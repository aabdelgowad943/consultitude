import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';
import { CreateAiConsultantComponent } from '../../components/create-ai-consultant/create-ai-consultant.component';
import { EditAiConsultantComponent } from '../../components/edit-ai-consultant/edit-ai-consultant.component';
import { AgentsService } from '../../../dashboard/services/agents.service';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-agents',
  imports: [
    CommonModule,
    RouterModule,
    PaginatorModule,
    CreateAiConsultantComponent,
    // EditAiConsultantComponent,
    FormsModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.scss',
  providers: [DialogService],
})
export class AgentsComponent implements OnInit {
  constructor(
    private agentService: AgentsService,
    private dialogService: DialogService
  ) {}

  profileId: string = localStorage.getItem('profileId') || '';

  loading: boolean = false;

  // DialogRef for managing dialog references
  dialogRef: DynamicDialogRef | undefined;

  // PrimeNG Pagination properties
  first: number = 0;
  pageSize: number = 9;
  totalRecords: number = 0;

  allAgents: any = [];
  filteredAgents: any = [];

  displayEditDialog: boolean = false;
  displayEditConsultantDialog: boolean = false;
  selectedAgent: any = null;

  // Filtering properties
  activeFilter: 'all' | 'byme' | 'consultitude' = 'all';
  searchTerm: string = '';

  ngOnInit(): void {
    this.getAllAgents();
  }

  getAllAgents(params: any = {}) {
    this.loading = true;
    const currentPage = Math.floor(this.first / this.pageSize) + 1;

    // Prepare filter parameters
    const filterParams: any = {
      page: currentPage,
      limit: this.pageSize,
      search: this.searchTerm || undefined,
    };

    // Add specific filters based on activeFilter
    if (this.activeFilter === 'byme') {
      filterParams.profileId = this.profileId;
    } else if (this.activeFilter === 'consultitude') {
      filterParams.type = ['EVO_USER'];
    }

    // Merge any additional params (like search)
    Object.assign(filterParams, params);

    this.agentService.getAllAgents(filterParams).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.allAgents = res.data;
        this.filteredAgents = res.data;
        this.totalRecords = res.meta.totalItems;
      },
      error: (err) => {
        console.error('Error fetching agents', err);
      },
    });
  }

  // PrimeNG Page Change Handler
  onPageChange(event: any) {
    this.first = event.first;
    this.pageSize = event.rows;
    this.getAllAgents();
  }

  // Filtering method
  filterAgents(filter: 'all' | 'byme' | 'consultitude') {
    this.activeFilter = filter;
    this.first = 0; // Reset pagination to first page
    this.getAllAgents();
  }

  // Search method
  searchAgents() {
    this.first = 0; // Reset pagination to first page
    this.getAllAgents();
  }

  openDialog() {
    this.displayEditDialog = true;
  }

  onDisplayChange(value: boolean) {
    this.displayEditDialog = value;
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
    this.openDropdownIndex = null;
    this.openEditDialog(agent);
  }

  toggleActivation(agent: any, event: Event): void {
    event.stopPropagation();
    agent.isActive = !agent.isActive;

    this.agentService.toggleStatus(agent.id, agent).subscribe({
      next: (res: any) => {
        this.getAllAgents();
      },
    });
  }

  openEditDialog(agent: any) {
    this.selectedAgent = agent;

    // Close any existing dialogs
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    // Open the dialog with the EditAiConsultantComponent
    this.dialogRef = this.dialogService.open(EditAiConsultantComponent, {
      header: 'Edit AI Consultant',
      width: '600px',
      height: '600px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true,
      data: agent, // Pass the selected agent data to the dialog
    });

    // Subscribe to the dialog close event
    this.dialogRef.onClose.subscribe((result) => {
      if (result) {
        // If dialog returns a result (e.g., agent was updated)
        this.getAllAgents();
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
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

  ngOnDestroy() {
    // Ensure all dialogs are closed when the component is destroyed
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
