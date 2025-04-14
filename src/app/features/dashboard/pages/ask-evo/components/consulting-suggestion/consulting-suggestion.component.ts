import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AgentsService,
  AgentFilterParams,
} from '../../../../services/agents.service';
import { FormsModule } from '@angular/forms';

export interface Consultant {
  id: number;
  type: string;
  description: string;
  creator: {
    name: string;
    avatar: string | null;
    initial?: string;
  };
  likes: number;
  icon: string;
  selected?: boolean;
  profileId?: string;
  agentId?: string;
}

interface ApiResponseMeta {
  requestId: string;
  timestamp: string;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

@Component({
  selector: 'app-consulting-suggestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulting-suggestion.component.html',
  styleUrl: './consulting-suggestion.component.scss',
})
export class ConsultingSuggestionComponent implements OnInit {
  @Input() suggestedAgents: any[] = [];
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() selectedConsultantsChange = new EventEmitter<Consultant[]>();
  @Input() selectionMap: Map<string, boolean> = new Map();

  private readonly maxSelectedConsultants = 3;

  suggestedConsultants: Consultant[] = [];
  filteredAgents: Consultant[] = []; // Use this as the single source of truth for displayed consultants

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  totalPages = 0;

  // UI states
  isLoading = false;
  error: string | null = null;
  activeFilter: 'all' | 'byme' | 'consultitude' = 'all';
  searchTerm: string = '';
  showFilterDropdown = false;

  // Consultant selector modal
  showConsultantSelector = false;
  currentSlotIndex: number | null = null;
  selectorSearchTerm: string = '';
  filteredSelectorConsultants: Consultant[] = [];

  // New properties for modal filter and pagination
  selectorCurrentPage = 1;
  selectorTotalPages = 0;
  selectorTotalItems = 0;
  selectorItemsPerPage = 6;
  selectorIsLoading = false;
  selectorError: string | null = null;
  selectorActiveFilter: 'all' | 'byme' | 'consultitude' = 'all';
  showSelectorFilterDropdown = false;

  constructor(private agentService: AgentsService) {}

  ngOnInit() {
    this.initializeSuggestedConsultants();
    this.fetchConsultants();
  }

  private initializeSuggestedConsultants() {
    if (this.suggestedAgents && this.suggestedAgents.length > 0) {
      this.suggestedConsultants = this.suggestedAgents
        .slice(0, 3)
        .map((agent, index) => {
          const consultant = {
            id: index + 1,
            type: agent.name || 'Consultant',
            description: agent.persona,
            creator: {
              name: agent.name || 'Consultitude',
              avatar: 'images/new/circle.svg',
            },
            likes: 1,
            icon: this.getIconForIndex(index),
            selected: true, // Default to true
            profileId: agent.profileId,
            agentId: agent.agentId,
          };

          // Check if we have a stored selection state for this consultant
          const key = consultant.agentId || consultant.id.toString();
          if (this.selectionMap.has(key)) {
            consultant.selected = this.selectionMap.get(key)!;
          }

          return consultant;
        });
    }
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
              const consultant = {
                id:
                  (response.meta.currentPage - 1) * response.meta.itemsPerPage +
                  index +
                  1,
                type: agent.name || 'Consultant',
                description: agent.persona,
                creator: {
                  name: agent.owner || 'Unknown',
                  avatar: 'images/new/circle.svg',
                },
                likes: agent.usage || 0,
                icon: this.getIconForIndex(index),
                selected: false,
                profileId: agent.profileId,
                agentId: agent.id,
              };

              // Check if we have a stored selection state for this consultant
              const key = consultant.agentId || consultant.id.toString();
              if (this.selectionMap.has(key)) {
                consultant.selected = this.selectionMap.get(key)!;
              }

              return consultant;
            }
          );

          // Update pagination data from meta
          if (response.meta) {
            const meta: ApiResponseMeta = response.meta;
            this.totalItems = meta.totalItems;
            this.itemsPerPage = meta.itemsPerPage;
            this.currentPage = meta.currentPage;
            this.totalPages = meta.totalPages;
          }
        } else {
          this.error = 'Invalid response format from server';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching agents:', err);
        this.error = 'Failed to load consultants';
        this.isLoading = false;
      },
    });
  }

  // New method for fetching consultants in the modal
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
                description: agent.persona,
                creator: {
                  name: agent.owner || 'Unknown',
                  avatar: 'images/new/circle.svg',
                },
                likes: agent.usage || 0,
                icon: this.getIconForIndex(index),
                selected: false,
                profileId: agent.profileId,
                agentId: agent.id,
              };

              // Check if we have a stored selection state for this consultant
              const key = consultant.agentId || consultant.id.toString();
              if (this.selectionMap.has(key)) {
                consultant.selected = this.selectionMap.get(key)!;
              }

              return consultant;
            }
          );

          // Update pagination data from meta
          if (response.meta) {
            const meta: ApiResponseMeta = response.meta;
            this.selectorTotalItems = meta.totalItems;
            this.selectorItemsPerPage = meta.itemsPerPage;
            this.selectorCurrentPage = meta.currentPage;
            this.selectorTotalPages = meta.totalPages;
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

  // Filter and search methods
  searchAgents() {
    this.currentPage = 1; // Reset to first page when searching
    this.fetchConsultants();
  }

  filterAgents(filter: 'all' | 'byme' | 'consultitude') {
    this.activeFilter = filter;
    this.currentPage = 1; // Reset to first page when filtering
    this.fetchConsultants();
  }

  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  getActiveFilterLabel(): string {
    switch (this.activeFilter) {
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

  // New methods for modal filter and search
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

  // Selection methods
  toggleSuggestedSelection(consultant: Consultant) {
    consultant.selected = !consultant.selected;
    this.updateSelectionMap(consultant);
    this.selectedConsultantsChange.emit(this.allSelectedConsultants);
  }

  toggleOtherSelection(consultant: Consultant) {
    if (
      !consultant.selected &&
      this.selectedConsultantsCount >= this.maxSelectedConsultants
    ) {
      return;
    }
    consultant.selected = !consultant.selected;
    this.updateSelectionMap(consultant);
    this.selectedConsultantsChange.emit(this.allSelectedConsultants);
  }

  private updateSelectionMap(consultant: Consultant) {
    const key = consultant.agentId || consultant.id.toString();
    this.selectionMap.set(key, consultant.selected || false);
  }

  // Pagination methods
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchConsultants();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchConsultants();
    }
  }

  // New pagination methods for modal
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

  // Navigation methods
  goToPreviousStep() {
    this.previous.emit();
  }

  continueToNextStep() {
    this.selectedConsultantsChange.emit(this.allSelectedConsultants);
    this.continue.emit();
  }

  // Computed properties
  get selectedConsultantsCount(): number {
    return (
      this.suggestedConsultants.filter((c) => c.selected).length +
      this.filteredAgents.filter((c) => c.selected).length
    );
  }

  get allSelectedConsultants(): Consultant[] {
    return [
      ...this.suggestedConsultants.filter((c) => c.selected),
      ...this.filteredAgents.filter((c) => c.selected),
    ];
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Check if the click was outside the dropdown
    const clickedElement = event.target as HTMLElement;
    const dropdownButton = document.querySelector('.filter-dropdown-button');
    const dropdownContent = document.querySelector('.filter-dropdown-content');
    const selectorDropdownButton = document.querySelector(
      '.selector-filter-dropdown-button'
    );
    const selectorDropdownContent = document.querySelector(
      '.selector-filter-dropdown-content'
    );

    // If we have a dropdown open and click is outside both the button and content
    if (
      this.showFilterDropdown &&
      dropdownButton &&
      dropdownContent &&
      !dropdownButton.contains(clickedElement) &&
      !dropdownContent.contains(clickedElement)
    ) {
      this.showFilterDropdown = false;
    }

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

  // Methods for consultant selection modal
  openConsultantSelector(slotIndex: number) {
    this.currentSlotIndex = slotIndex;
    this.selectorSearchTerm = '';
    this.selectorActiveFilter = 'all';
    this.selectorCurrentPage = 1;
    this.showConsultantSelector = true;
    this.fetchSelectorConsultants(); // Fetch consultants when opening the modal
  }

  closeConsultantSelector() {
    this.showConsultantSelector = false;
    this.currentSlotIndex = null;
  }

  selectConsultantForSlot(consultant: Consultant) {
    if (this.currentSlotIndex === null) return;

    // First, check if consultant is already selected
    if (consultant.selected) {
      // If it's already selected, deselect it from where it is
      consultant.selected = false;
      this.updateSelectionMap(consultant);
    }

    // Then update the suggested consultant in the slot
    const slotConsultant = this.suggestedConsultants[this.currentSlotIndex];

    // If there was a consultant in this slot, deselect it
    if (slotConsultant.selected) {
      slotConsultant.selected = false;
      this.updateSelectionMap(slotConsultant);
    }

    // Create a new consultant for the slot with the selected consultant's data
    this.suggestedConsultants[this.currentSlotIndex] = {
      ...consultant,
      selected: true,
      id: slotConsultant.id, // Keep the original ID for the slot
    };

    this.updateSelectionMap(this.suggestedConsultants[this.currentSlotIndex]);
    this.selectedConsultantsChange.emit(this.allSelectedConsultants);
    this.closeConsultantSelector();
  }
}
