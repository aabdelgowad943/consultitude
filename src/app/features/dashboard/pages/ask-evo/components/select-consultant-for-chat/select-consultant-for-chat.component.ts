import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  AgentsService,
  AgentFilterParams,
} from '../../../../services/agents.service';
import { Consultant } from '../../../../models/consultant';
import { ApiResponseMeta } from '../../../../models/api-response-meta';

@Component({
  selector: 'app-select-consultant-for-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-consultant-for-chat.component.html',
  styleUrl: './select-consultant-for-chat.component.scss',
})
export class SelectConsultantForChatComponent implements OnInit {
  hasSelectedConsultant = false;

  // UI states
  isLoading = false;
  error: string | null = null;
  showFilterDropdown = false;
  activeFilter: 'all' | 'byme' | 'consultitude' = 'all';
  searchTerm: string = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  totalPages = 0;

  // Data
  filteredAgents: Consultant[] = [];
  selectedConsultant: Consultant | null = null;
  // selectedConsultants: Consultant[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private agentService: AgentsService
  ) {}

  ngOnInit() {
    // Get initially selected consultants from dialog config
    if (this.config.data && this.config.data.selectedConsultant) {
      this.selectedConsultant = this.config.data.selectedConsultant;
    }

    // Initialize with backend fetch
    this.fetchConsultants();
  }

  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  filterAgents(filter: 'all' | 'byme' | 'consultitude') {
    this.activeFilter = filter;
    this.currentPage = 1; // Reset to first page when filter changes
    this.fetchConsultants();
  }

  searchConsultants() {
    this.currentPage = 1; // Reset to first page when search changes
    this.fetchConsultants();
  }

  fetchConsultants() {
    this.isLoading = true;
    this.error = null;

    const params: AgentFilterParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
      search: this.searchTerm || undefined,
    };

    // Add filter based on activeFilter
    if (this.activeFilter === 'byme') {
      params.profileId = localStorage.getItem('profileId') || '';
    } else if (this.activeFilter === 'consultitude') {
      params.type = ['EVO_USER'];
    }

    this.agentService.getAllAgents(params).subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.filteredAgents = response.data.map(
            (agent: any, index: number) => {
              // Combine domains and sectors for a richer description if persona is empty
              const description = agent.persona;

              const consultant = {
                id:
                  (response.meta.currentPage - 1) * response.meta.itemsPerPage +
                  index +
                  1,
                type: agent.name || 'Consultant',
                description: description,
                creator: {
                  name: agent.owner || 'Unknown',
                  avatar: 'images/new/circle.svg',
                },
                likes: agent.usage || 0,
                icon: this.getIconForIndex(index),
                selected: false,
                profileId: agent.profileId || '',
                agentId: agent.id || '',
              };

              // Check if this consultant is the selected one
              if (
                this.selectedConsultant &&
                this.selectedConsultant.agentId === consultant.agentId
              ) {
                consultant.selected = true;
              }

              return consultant;
            }
          );

          // Update pagination data from meta
          if (response.meta) {
            const meta: ApiResponseMeta = response.meta;
            this.totalItems = meta.totalItems || 0;
            this.itemsPerPage = meta.itemsPerPage || 10;
            this.currentPage = meta.currentPage || 1;
            this.totalPages = meta.totalPages || 1;
          }
        } else {
          this.error = 'Invalid response format from server';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load consultants';
        this.isLoading = false;
      },
    });
  }

  private getIconForIndex(index: number): string {
    const icons = [
      'pi-comments',
      'pi-user',
      'pi-clock',
      'pi-inbox',
      'pi-users',
      'pi-chart-bar',
    ];
    return icons[index % icons.length];
  }

  getPaginatedConsultants(): Consultant[] {
    return this.filteredAgents;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchConsultants();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchConsultants();
    }
  }

  selectConsultant(consultant: Consultant) {
    // If we already have a selection and it's not the same as the new one, deselect it
    if (
      this.selectedConsultant &&
      this.selectedConsultant.agentId !== consultant.agentId
    ) {
      // Find the old consultant in the filteredAgents array and deselect it
      const oldConsultantIndex = this.filteredAgents.findIndex(
        (c) => c.agentId === this.selectedConsultant?.agentId
      );

      if (oldConsultantIndex >= 0) {
        this.filteredAgents[oldConsultantIndex].selected = false;
      }
    }

    // Set the new selection
    this.selectedConsultant = consultant;

    // Find the consultant in the array and update its selected state
    const consultantIndex = this.filteredAgents.findIndex(
      (c) => c.agentId === consultant.agentId
    );

    if (consultantIndex >= 0) {
      this.filteredAgents[consultantIndex].selected = true;
    }

    // Close the dialog with the selected consultant
    this.ref.close(consultant);
  }

  toggleConsultantSelection(consultant: Consultant) {
    // If clicking on the already selected consultant, deselect it
    if (
      this.selectedConsultant &&
      this.selectedConsultant.agentId === consultant.agentId
    ) {
      // Deselect current consultant
      consultant.selected = false;
      this.selectedConsultant = null;
    } else {
      // Deselect the previously selected consultant if any
      if (this.selectedConsultant) {
        // Find the old consultant in the filteredAgents array and deselect it
        const oldConsultantIndex = this.filteredAgents.findIndex(
          (c) => c.agentId === this.selectedConsultant?.agentId
        );

        if (oldConsultantIndex >= 0) {
          this.filteredAgents[oldConsultantIndex].selected = false;
        }
      }

      // Select the new consultant
      consultant.selected = true;
      this.selectedConsultant = consultant;
    }
  }

  // Modify the selectConsultant method to handle confirm selection
  confirmSelection() {
    // Close the dialog with the selected consultant (or null if none selected)
    this.ref.close(this.selectedConsultant);
  }

  closeDialog() {
    this.ref.close(
      // the selected consultant or null if none selected
      this.selectedConsultant ? this.selectedConsultant : null
    );
  }
}
