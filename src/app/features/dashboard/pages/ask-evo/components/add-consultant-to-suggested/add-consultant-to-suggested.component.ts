import {
  Component,
  EventEmitter,
  Input,
  Output,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Consultant } from '../../../../models/consultant';
import {
  AgentsService,
  AgentFilterParams,
} from '../../../../services/agents.service';
import { ApiResponseMeta } from '../../../../models/api-response-meta';

@Component({
  selector: 'app-add-consultant-to-suggested',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-consultant-to-suggested.component.html',
  styleUrl: './add-consultant-to-suggested.component.scss',
})
export class AddConsultantToSuggestedComponent {
  @Input() visible = false;
  @Input() currentSlotIndex: number | null = null;
  @Input() selectedConsultants: Consultant[] = [];
  @Input() suggestedConsultants: Consultant[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() consultantSelected = new EventEmitter<{
    consultant: Consultant;
    slotIndex: number;
  }>();

  // Search and filter
  selectorSearchTerm: string = '';
  filteredSelectorConsultants: Consultant[] = [];

  // Pagination
  selectorCurrentPage = 1;
  selectorTotalPages = 0;
  selectorTotalItems = 0;
  selectorItemsPerPage = 6;

  // UI state
  selectorIsLoading = false;
  selectorError: string | null = null;
  selectorActiveFilter: 'all' | 'byme' | 'consultitude' = 'all';
  showSelectorFilterDropdown = false;

  constructor(private agentService: AgentsService) {}

  ngOnChanges() {
    // When modal becomes visible, fetch consultants
    if (this.visible) {
      this.resetModalState();
      this.fetchSelectorConsultants();
    }
  }

  private resetModalState() {
    this.selectorSearchTerm = '';
    this.selectorActiveFilter = 'all';
    this.selectorCurrentPage = 1;
  }

  fetchSelectorConsultants() {
    this.selectorIsLoading = true;
    this.selectorError = null;

    const params: AgentFilterParams = {
      page: this.selectorCurrentPage,
      limit: this.selectorItemsPerPage,
      search: this.selectorSearchTerm || undefined,
    };

    // Add filter based on activeFilter
    if (this.selectorActiveFilter === 'byme') {
      params.profileId = localStorage.getItem('profileId') || '';
    } else if (this.selectorActiveFilter === 'consultitude') {
      params.type = ['EVO_USER'];
    }

    this.agentService.getAllAgents(params).subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.filteredSelectorConsultants = response.data.map(
            (agent: any, index: number) => {
              const consultant = {
                id:
                  (response.meta.currentPage - 1) * response.meta.itemsPerPage +
                  index +
                  1,
                type: agent.name || 'Consultant',
                description: agent.persona || '',
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

              // Check if this consultant is already in the selectedConsultants list
              if (
                this.selectedConsultants.some(
                  (selected) => selected.agentId === consultant.agentId
                )
              ) {
                consultant.selected = true;
              }

              return consultant;
            }
          );

          // Update pagination data from meta
          if (response.meta) {
            const meta: ApiResponseMeta = response.meta;
            this.selectorTotalItems = meta.totalItems || 0;
            this.selectorItemsPerPage = meta.itemsPerPage || 10;
            this.selectorCurrentPage = meta.currentPage || 1;
            this.selectorTotalPages = meta.totalPages || 1;
          }
        } else {
          this.selectorError = 'Invalid response format from server';
        }
        this.selectorIsLoading = false;
      },
      error: (err) => {
        console.error('Error fetching agents for selector:', err);
        this.selectorError = 'Failed to load consultants';
        this.selectorIsLoading = false;
      },
    });
  }

  // Filter methods for selector modal
  searchSelectorConsultants() {
    this.selectorCurrentPage = 1; // Reset to first page when searching
    this.fetchSelectorConsultants();
  }

  filterSelectorAgents(filter: 'all' | 'byme' | 'consultitude') {
    this.selectorActiveFilter = filter;
    this.selectorCurrentPage = 1; // Reset to first page when filtering
    this.fetchSelectorConsultants();
  }

  toggleSelectorFilterDropdown() {
    this.showSelectorFilterDropdown = !this.showSelectorFilterDropdown;
  }

  getSelectorActiveFilterLabel(): string {
    switch (this.selectorActiveFilter) {
      case 'all':
        return 'All';
      case 'byme':
        return 'By me';
      case 'consultitude':
        return 'Consultitude';
      default:
        return 'All';
    }
  }

  // Pagination methods for selector modal
  nextSelectorPage() {
    if (this.selectorCurrentPage < this.selectorTotalPages) {
      this.selectorCurrentPage++;
      this.fetchSelectorConsultants();
    }
  }

  previousSelectorPage() {
    if (this.selectorCurrentPage > 1) {
      this.selectorCurrentPage--;
      this.fetchSelectorConsultants();
    }
  }

  // Check if a consultant is already selected in any slot
  isConsultantAlreadySelected(consultant: Consultant): boolean {
    // Skip checking the current slot if we're replacing a slot
    if (this.currentSlotIndex !== null) {
      // If the current consultant in the slot is selected, we don't count it for duplicate check
      const currentSlotConsultant =
        this.suggestedConsultants[this.currentSlotIndex];
      if (
        currentSlotConsultant &&
        currentSlotConsultant.agentId === consultant.agentId
      ) {
        return false;
      }
    }

    // Check if this consultant is already selected in any other slot
    return this.selectedConsultants.some(
      (c) =>
        c.agentId === consultant.agentId &&
        !(
          this.currentSlotIndex !== null &&
          this.suggestedConsultants[this.currentSlotIndex].agentId === c.agentId
        )
    );
  }

  selectConsultantForSlot(consultant: Consultant) {
    if (this.currentSlotIndex === null) return;

    // Check if the consultant is already selected elsewhere
    if (this.isConsultantAlreadySelected(consultant)) {
      return; // Exit without selecting if already selected elsewhere
    }

    this.consultantSelected.emit({
      consultant,
      slotIndex: this.currentSlotIndex,
    });

    this.closeModal();
  }

  closeModal() {
    this.close.emit();
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

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if the click was outside the dropdown
    const clickedElement = event.target as HTMLElement;
    const selectorDropdownButton = document.querySelector(
      '.selector-filter-dropdown-button'
    );
    const selectorDropdownContent = document.querySelector(
      '.selector-filter-dropdown-content'
    );

    // Handle the selector filter dropdown
    if (
      this.showSelectorFilterDropdown &&
      selectorDropdownButton &&
      selectorDropdownContent &&
      !selectorDropdownButton.contains(clickedElement) &&
      !selectorDropdownContent.contains(clickedElement)
    ) {
      this.showSelectorFilterDropdown = false;
    }
  }
}
