// import {
//   Component,
//   EventEmitter,
//   Input,
//   OnInit,
//   Output,
//   HostListener,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   AgentsService,
//   AgentFilterParams,
// } from '../../../../services/agents.service';
// import { FormsModule } from '@angular/forms';
// import { Consultant } from '../../../../models/consultant';
// import { ApiResponseMeta } from '../../../../models/api-response-meta';

// @Component({
//   selector: 'app-consulting-suggestion',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './consulting-suggestion.component.html',
//   styleUrl: './consulting-suggestion.component.scss',
// })
// export class ConsultingSuggestionComponent implements OnInit {
//   @Input() suggestedAgents: any[] = [];
//   @Output() continue = new EventEmitter<void>();
//   @Output() previous = new EventEmitter<void>();
//   @Output() selectedConsultantsChange = new EventEmitter<Consultant[]>();
//   @Input() selectionMap: Map<string, boolean> = new Map();
//   @Input() selectedConsultants: Consultant[] = [];

//   readonly maxSelectedConsultants = 3;

//   suggestedConsultants: Consultant[] = [];
//   filteredAgents: Consultant[] = []; // Use this as the single source of truth for displayed consultants

//   // Pagination
//   currentPage = 1;
//   itemsPerPage = 6;
//   totalItems = 0;
//   totalPages = 0;

//   // UI states
//   isLoading = false;
//   error: string | null = null;
//   activeFilter: 'all' | 'byme' | 'consultitude' = 'all';
//   searchTerm: string = '';
//   showFilterDropdown = false;

//   // Consultant selector modal
//   showConsultantSelector = false;
//   currentSlotIndex: number | null = null;
//   selectorSearchTerm: string = '';
//   filteredSelectorConsultants: Consultant[] = [];

//   // New properties for modal filter and pagination
//   selectorCurrentPage = 1;
//   selectorTotalPages = 0;
//   selectorTotalItems = 0;
//   selectorItemsPerPage = 6;
//   selectorIsLoading = false;
//   selectorError: string | null = null;
//   selectorActiveFilter: 'all' | 'byme' | 'consultitude' = 'all';
//   showSelectorFilterDropdown = false;

//   constructor(private agentService: AgentsService) {}

//   ngOnInit() {
//     this.initializeSuggestedConsultants();
//     this.fetchConsultants();
//   }

//   private initializeSuggestedConsultants() {
//     if (this.suggestedAgents && this.suggestedAgents.length > 0) {
//       this.suggestedConsultants = this.suggestedAgents.map((agent, index) => {
//         const consultant = {
//           id: index + 1,
//           type: agent.name || 'Consultant',
//           description: agent.persona,
//           creator: {
//             name: agent.name || 'Consultitude',
//             avatar: 'images/new/circle.svg',
//           },
//           likes: 1,
//           icon: this.getIconForIndex(index),
//           selected: false, // Default to false
//           profileId: agent.profileId,
//           agentId: agent.agentId,
//         };

//         // Check if the consultant is in the selectedConsultants list
//         const isSelected = this.selectedConsultants.some(
//           (selected) => selected.agentId === consultant.agentId
//         );
//         consultant.selected = isSelected;

//         return consultant;
//       });
//     }
//   }

//   fetchConsultants() {
//     this.isLoading = true;
//     this.error = null;

//     const params: AgentFilterParams = {
//       page: this.currentPage,
//       limit: this.itemsPerPage,
//       search: this.searchTerm || undefined,
//     };

//     // Add filter based on activeFilter
//     if (this.activeFilter === 'byme') {
//       params.profileId = localStorage.getItem('profileId') || '';
//     } else if (this.activeFilter === 'consultitude') {
//       params.type = ['EVO_USER'];
//     }

//     this.agentService.getAllAgents(params).subscribe({
//       next: (response: any) => {
//         if (response.success && Array.isArray(response.data)) {
//           this.filteredAgents = response.data.map(
//             (agent: any, index: number) => {
//               const consultant = {
//                 id:
//                   (response.meta.currentPage - 1) * response.meta.itemsPerPage +
//                   index +
//                   1,
//                 type: agent.name || 'Consultant',
//                 description: agent.persona,
//                 creator: {
//                   name: agent.owner || 'Unknown',
//                   avatar: 'images/new/circle.svg',
//                 },
//                 likes: agent.usage || 0,
//                 icon: this.getIconForIndex(index),
//                 selected: false,
//                 profileId: agent.profileId,
//                 agentId: agent.id,
//               };

//               // Check if we have a stored selection state for this consultant
//               const key = consultant.agentId || consultant.id.toString();
//               if (this.selectionMap.has(key)) {
//                 consultant.selected = this.selectionMap.get(key)!;
//               }

//               return consultant;
//             }
//           );

//           // Update pagination data from meta
//           if (response.meta) {
//             const meta: ApiResponseMeta = response.meta;
//             this.totalItems = meta.totalItems;
//             this.itemsPerPage = meta.itemsPerPage;
//             this.currentPage = meta.currentPage;
//             this.totalPages = meta.totalPages;
//           }
//         } else {
//           this.error = 'Invalid response format from server';
//         }
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching agents:', err);
//         this.error = 'Failed to load consultants';
//         this.isLoading = false;
//       },
//     });
//   }

//   // New method for fetching consultants in the modal
//   fetchSelectorConsultants() {
//     this.selectorIsLoading = true;
//     this.selectorError = null;

//     const params: AgentFilterParams = {
//       page: this.selectorCurrentPage,
//       limit: this.selectorItemsPerPage,
//       search: this.selectorSearchTerm || undefined,
//     };

//     // Add filter based on activeFilter
//     if (this.selectorActiveFilter === 'byme') {
//       params.profileId = localStorage.getItem('profileId') || '';
//     } else if (this.selectorActiveFilter === 'consultitude') {
//       params.type = ['EVO_USER'];
//     }

//     this.agentService.getAllAgents(params).subscribe({
//       next: (response: any) => {
//         if (response.success && Array.isArray(response.data)) {
//           this.filteredSelectorConsultants = response.data.map(
//             (agent: any, index: number) => {
//               const consultant = {
//                 id:
//                   (response.meta.currentPage - 1) * response.meta.itemsPerPage +
//                   index +
//                   1,
//                 type: agent.name || 'Consultant',
//                 description: agent.persona,
//                 creator: {
//                   name: agent.owner || 'Unknown',
//                   avatar: 'images/new/circle.svg',
//                 },
//                 likes: agent.usage || 0,
//                 icon: this.getIconForIndex(index),
//                 selected: false,
//                 profileId: agent.profileId,
//                 agentId: agent.id,
//               };

//               // Check if we have a stored selection state for this consultant
//               const key = consultant.agentId || consultant.id.toString();
//               if (this.selectionMap.has(key)) {
//                 consultant.selected = this.selectionMap.get(key)!;
//               }

//               return consultant;
//             }
//           );

//           // Update pagination data from meta
//           if (response.meta) {
//             const meta: ApiResponseMeta = response.meta;
//             this.selectorTotalItems = meta.totalItems;
//             this.selectorItemsPerPage = meta.itemsPerPage;
//             this.selectorCurrentPage = meta.currentPage;
//             this.selectorTotalPages = meta.totalPages;
//           }
//         } else {
//           this.selectorError = 'Invalid response format from server';
//         }
//         this.selectorIsLoading = false;
//       },
//       error: (err) => {
//         console.error('Error fetching agents for selector:', err);
//         this.selectorError = 'Failed to load consultants';
//         this.selectorIsLoading = false;
//       },
//     });
//   }

//   private getIconForIndex(index: number): string {
//     const icons = [
//       'pi-comments',
//       'pi-user',
//       'pi-clock',
//       'pi-inbox',
//       'pi-users',
//       'pi-chart-bar',
//     ];
//     return icons[index % icons.length];
//   }

//   // Filter and search methods
//   searchAgents() {
//     this.currentPage = 1; // Reset to first page when searching
//     this.fetchConsultants();
//   }

//   filterAgents(filter: 'all' | 'byme' | 'consultitude') {
//     this.activeFilter = filter;
//     this.currentPage = 1; // Reset to first page when filtering
//     this.fetchConsultants();
//   }

//   toggleFilterDropdown() {
//     this.showFilterDropdown = !this.showFilterDropdown;
//   }

//   getActiveFilterLabel(): string {
//     switch (this.activeFilter) {
//       case 'all':
//         return 'All';
//       case 'byme':
//         return 'By me';
//       case 'consultitude':
//         return 'Consultitude';
//       default:
//         return 'All';
//     }
//   }

//   // New methods for modal filter and search
//   searchSelectorConsultants() {
//     this.selectorCurrentPage = 1; // Reset to first page when searching
//     this.fetchSelectorConsultants();
//   }

//   filterSelectorAgents(filter: 'all' | 'byme' | 'consultitude') {
//     this.selectorActiveFilter = filter;
//     this.selectorCurrentPage = 1; // Reset to first page when filtering
//     this.fetchSelectorConsultants();
//   }

//   toggleSelectorFilterDropdown() {
//     this.showSelectorFilterDropdown = !this.showSelectorFilterDropdown;
//   }

//   getSelectorActiveFilterLabel(): string {
//     switch (this.selectorActiveFilter) {
//       case 'all':
//         return 'All';
//       case 'byme':
//         return 'By me';
//       case 'consultitude':
//         return 'Consultitude';
//       default:
//         return 'All';
//     }
//   }

//   // Selection methods
//   toggleSuggestedSelection(consultant: Consultant) {
//     consultant.selected = !consultant.selected;
//     this.updateSelectionMap(consultant);
//     this.selectedConsultantsChange.emit(this.allSelectedConsultants);
//   }

//   toggleOtherSelection(consultant: Consultant) {
//     // Enforce maximum selection limit
//     if (
//       !consultant.selected &&
//       this.selectedConsultantsCount >= this.maxSelectedConsultants
//     ) {
//       return; // Prevent selection if already at max
//     }
//     consultant.selected = !consultant.selected;
//     this.updateSelectionMap(consultant);
//     this.selectedConsultantsChange.emit(this.allSelectedConsultants);
//   }

//   private updateSelectionMap(consultant: Consultant) {
//     const key = consultant.agentId || consultant.id.toString();
//     this.selectionMap.set(key, consultant.selected || false);
//   }

//   // Pagination methods
//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++;
//       this.fetchConsultants();
//     }
//   }

//   previousPage() {
//     if (this.currentPage > 1) {
//       this.currentPage--;
//       this.fetchConsultants();
//     }
//   }

//   // New pagination methods for modal
//   nextSelectorPage() {
//     if (this.selectorCurrentPage < this.selectorTotalPages) {
//       this.selectorCurrentPage++;
//       this.fetchSelectorConsultants();
//     }
//   }

//   previousSelectorPage() {
//     if (this.selectorCurrentPage > 1) {
//       this.selectorCurrentPage--;
//       this.fetchSelectorConsultants();
//     }
//   }

//   // Navigation methods
//   goToPreviousStep() {
//     this.previous.emit();
//   }

//   continueToNextStep() {
//     this.selectedConsultantsChange.emit(this.allSelectedConsultants); // Emit only the currently selected consultants
//     this.continue.emit();
//   }

//   // Check if a consultant is already selected in any slot
//   isConsultantAlreadySelected(consultant: Consultant): boolean {
//     // Skip checking the current slot if we're replacing a slot
//     if (this.currentSlotIndex !== null) {
//       // If the current consultant in the slot is selected, we don't count it for duplicate check
//       const currentSlotConsultant =
//         this.suggestedConsultants[this.currentSlotIndex];
//       if (
//         currentSlotConsultant &&
//         currentSlotConsultant.agentId === consultant.agentId
//       ) {
//         return false;
//       }
//     }

//     // Check if this consultant is already selected in any other slot
//     const isSelectedInSuggestedSlots = this.suggestedConsultants.some(
//       (c, index) =>
//         c.agentId === consultant.agentId &&
//         c.selected &&
//         index !== this.currentSlotIndex
//     );

//     // Check if selected in other consultants list
//     const isSelectedInOtherConsultants = this.filteredAgents.some(
//       (c) => c.agentId === consultant.agentId && c.selected
//     );

//     return isSelectedInSuggestedSlots || isSelectedInOtherConsultants;
//   }

//   // Computed properties
//   get selectedConsultantsCount(): number {
//     return this.allSelectedConsultants.length;
//   }

//   get allSelectedConsultants(): Consultant[] {
//     return [
//       ...this.suggestedConsultants.filter((c) => c.selected),
//       ...this.filteredAgents.filter((c) => c.selected),
//     ];
//   }

//   // Close dropdown when clicking outside
//   @HostListener('document:click', ['$event'])
//   onDocumentClick(event: MouseEvent) {
//     // Check if the click was outside the dropdown
//     const clickedElement = event.target as HTMLElement;
//     const dropdownButton = document.querySelector('.filter-dropdown-button');
//     const dropdownContent = document.querySelector('.filter-dropdown-content');
//     const selectorDropdownButton = document.querySelector(
//       '.selector-filter-dropdown-button'
//     );
//     const selectorDropdownContent = document.querySelector(
//       '.selector-filter-dropdown-content'
//     );

//     // If we have a dropdown open and click is outside both the button and content
//     if (
//       this.showFilterDropdown &&
//       dropdownButton &&
//       dropdownContent &&
//       !dropdownButton.contains(clickedElement) &&
//       !dropdownContent.contains(clickedElement)
//     ) {
//       this.showFilterDropdown = false;
//     }

//     // Handle the selector filter dropdown
//     if (
//       this.showSelectorFilterDropdown &&
//       selectorDropdownButton &&
//       selectorDropdownContent &&
//       !selectorDropdownButton.contains(clickedElement) &&
//       !selectorDropdownContent.contains(clickedElement)
//     ) {
//       this.showSelectorFilterDropdown = false;
//     }
//   }

//   // Methods for consultant selection modal
//   openConsultantSelector(slotIndex: number) {
//     this.currentSlotIndex = slotIndex;
//     this.selectorSearchTerm = '';
//     this.selectorActiveFilter = 'all';
//     this.selectorCurrentPage = 1;
//     this.showConsultantSelector = true;
//     this.fetchSelectorConsultants(); // Fetch consultants when opening the modal
//   }

//   closeConsultantSelector() {
//     this.showConsultantSelector = false;
//     this.currentSlotIndex = null;
//   }

//   selectConsultantForSlot(consultant: Consultant) {
//     if (this.currentSlotIndex === null) return;

//     // Check if the consultant is already selected elsewhere
//     if (this.isConsultantAlreadySelected(consultant)) {
//       return; // Exit without selecting if already selected elsewhere
//     }

//     // First, check if consultant is already selected
//     if (consultant.selected) {
//       // If it's already selected, deselect it from where it is
//       consultant.selected = false;
//       this.updateSelectionMap(consultant);
//     }

//     // Then update the suggested consultant in the slot
//     const slotConsultant = this.suggestedConsultants[this.currentSlotIndex];

//     // If there was a consultant in this slot, deselect it
//     if (slotConsultant.selected) {
//       slotConsultant.selected = false;
//       this.updateSelectionMap(slotConsultant);
//     }

//     // Create a new consultant for the slot with the selected consultant's data
//     this.suggestedConsultants[this.currentSlotIndex] = {
//       ...consultant,
//       selected: true,
//       id: slotConsultant.id, // Keep the UI ID for the slot
//       // But we preserve the original agentId and profileId
//     };

//     this.updateSelectionMap(this.suggestedConsultants[this.currentSlotIndex]);
//     this.selectedConsultantsChange.emit(this.allSelectedConsultants);
//     this.closeConsultantSelector();
//   }
// }

// consulting-suggestion.component.ts
// consulting-suggestion.component.ts
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  HostListener,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AgentsService,
  AgentFilterParams,
} from '../../../../services/agents.service';
import { FormsModule } from '@angular/forms';
import { Consultant } from '../../../../models/consultant';
import { ApiResponseMeta } from '../../../../models/api-response-meta';

@Component({
  selector: 'app-consulting-suggestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulting-suggestion.component.html',
  styleUrl: './consulting-suggestion.component.scss',
})
export class ConsultingSuggestionComponent implements OnInit, OnChanges {
  @Input() suggestedAgents: any[] = [];
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() selectedConsultantsChange = new EventEmitter<Consultant[]>();
  @Input() selectionMap: Map<string, boolean> = new Map();
  @Input() selectedConsultants: Consultant[] = [];

  readonly maxSelectedConsultants = 3;

  suggestedConsultants: Consultant[] = [];
  filteredAgents: Consultant[] = []; // Use this as the single source of truth for displayed consultants

  // Track if component has been initialized
  private initialized = false;

  // Store the IDs of consultants that were originally suggested
  private originalSuggestedAgentIds: string[] = [];

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
    this.initialized = true;

    // Log the structure of suggestedAgents for debugging
    if (this.suggestedAgents && this.suggestedAgents.length > 0) {
      console.log(
        'Suggested agents structure:',
        JSON.stringify(this.suggestedAgents[0], null, 2)
      );
    } else {
      console.log('No suggested agents available');
    }

    // Force the call to be deferred to ensure all inputs are initialized
    this.initializeSuggestedConsultants();
    this.fetchConsultants();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Only process changes after component has been initialized
    if (!this.initialized) return;

    if (changes['selectedConsultants']) {
      // When selectedConsultants changes, correctly distribute them across the UI
      this.redistributeConsultants();
    }
  }

  private redistributeConsultants() {
    // Update the suggestedConsultants array to match the current selected consultants
    this.updateSuggestedConsultantsFromSelection();

    // Update the filteredAgents to exclude the selected consultants
    this.updateFilteredAgentsFromSelection();
  }

  private updateSuggestedConsultantsFromSelection() {
    // Ensure we have enough slots (should be 3 slots)
    if (this.suggestedConsultants.length < this.maxSelectedConsultants) {
      // Add empty slots if needed
      const slotsToAdd =
        this.maxSelectedConsultants - this.suggestedConsultants.length;
      for (let i = 0; i < slotsToAdd; i++) {
        this.suggestedConsultants.push({
          id: this.suggestedConsultants.length + 1,
          type: 'Consultant',
          description: '',
          creator: {
            name: 'Consultitude',
            avatar: 'images/new/circle.svg',
          },
          likes: 1,
          icon: this.getIconForIndex(this.suggestedConsultants.length),
          selected: false,
          profileId: '',
          agentId: '',
        });
      }
    }

    // First, reset all slots to unselected
    this.suggestedConsultants.forEach((consultant) => {
      consultant.selected = false;
    });

    // Then place the selected consultants in the slots
    this.selectedConsultants.forEach((selectedConsultant, index) => {
      if (index < this.maxSelectedConsultants) {
        // Ensure the consultant has all required properties with defaults
        const validConsultant = {
          ...selectedConsultant,
          type: selectedConsultant.type || 'Consultant',
          description: selectedConsultant.description || '',
          creator: {
            name:
              (selectedConsultant.creator && selectedConsultant.creator.name) ||
              'Consultitude',
            avatar:
              (selectedConsultant.creator &&
                selectedConsultant.creator.avatar) ||
              'images/new/circle.svg',
          },
          likes: selectedConsultant.likes || 1,
          icon: selectedConsultant.icon || this.getIconForIndex(index),
          profileId: selectedConsultant.profileId || '',
          agentId: selectedConsultant.agentId || '',
        };

        // Copy data to the slot, maintaining the slot's ID
        const slotId = this.suggestedConsultants[index].id;
        this.suggestedConsultants[index] = {
          ...validConsultant,
          id: slotId,
          selected: true,
        };
      }
    });
  }

  private updateFilteredAgentsFromSelection() {
    // Mark consultants in filteredAgents as selected/unselected based on their presence in selectedConsultants
    this.filteredAgents.forEach((agent) => {
      agent.selected = this.selectedConsultants.some(
        (selected) => selected.agentId === agent.agentId
      );
    });
  }

  private initializeSuggestedConsultants() {
    if (this.suggestedAgents && this.suggestedAgents.length > 0) {
      this.suggestedConsultants = this.suggestedAgents.map((agent, index) => {
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
          selected: false, // Default to false
          profileId: agent.profileId,
          agentId: agent.agentId,
        };

        // Check if the consultant is in the selectedConsultants list
        const isSelected = this.selectedConsultants.some(
          (selected) => selected.agentId === consultant.agentId
        );
        consultant.selected = isSelected;

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

              // Check if we have a stored selection state for this consultant
              const key = consultant.agentId || consultant.id.toString();
              if (this.selectionMap.has(key)) {
                consultant.selected = this.selectionMap.get(key)!;
              }

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
    const wasSelected = consultant.selected;
    consultant.selected = !consultant.selected;
    this.updateSelectionMap(consultant);

    // If this consultant was deselected, we need to update the other lists
    if (wasSelected) {
      // Find the corresponding consultant in filteredAgents and deselect it
      const matchingConsultant = this.filteredAgents.find(
        (c) => c.agentId === consultant.agentId
      );
      if (matchingConsultant) {
        matchingConsultant.selected = false;
        this.updateSelectionMap(matchingConsultant);
      }
    }

    this.updateSelectedConsultantsList();
  }

  toggleOtherSelection(consultant: Consultant) {
    // Enforce maximum selection limit
    if (
      !consultant.selected &&
      this.selectedConsultantsCount >= this.maxSelectedConsultants
    ) {
      return; // Prevent selection if already at max
    }

    const wasSelected = consultant.selected;
    consultant.selected = !consultant.selected;
    this.updateSelectionMap(consultant);

    if (consultant.selected) {
      // Find an empty slot to place this consultant in
      const emptySlotIndex = this.suggestedConsultants.findIndex(
        (c) => !c.selected
      );
      if (emptySlotIndex !== -1) {
        // Create a copy of the consultant for the slot
        const slotConsultant = {
          ...consultant,
          id: this.suggestedConsultants[emptySlotIndex].id,
        };
        this.suggestedConsultants[emptySlotIndex] = slotConsultant;
      }
    } else {
      // If deselected, find and clear the consultant from the suggested slots
      const slotIndex = this.suggestedConsultants.findIndex(
        (c) => c.agentId === consultant.agentId
      );
      if (slotIndex !== -1) {
        this.suggestedConsultants[slotIndex].selected = false;
      }
    }

    this.updateSelectedConsultantsList();
  }

  private updateSelectionMap(consultant: Consultant) {
    const key = consultant.agentId || consultant.id.toString();
    this.selectionMap.set(key, consultant.selected || false);
  }

  private updateSelectedConsultantsList() {
    // Get all selected consultants from both the suggested slots and filtered list
    const selectedConsultants = [
      ...this.suggestedConsultants.filter((c) => c.selected),
      ...this.filteredAgents.filter(
        (c) =>
          c.selected &&
          !this.suggestedConsultants.some((sc) => sc.agentId === c.agentId)
      ),
    ];

    this.selectedConsultantsChange.emit(selectedConsultants);
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
    this.selectedConsultantsChange.emit(this.allSelectedConsultants); // Emit only the currently selected consultants
    this.continue.emit();
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
    const isSelectedInSuggestedSlots = this.suggestedConsultants.some(
      (c, index) =>
        c.agentId === consultant.agentId &&
        c.selected &&
        index !== this.currentSlotIndex
    );

    // Check if selected in other consultants list
    const isSelectedInOtherConsultants = this.filteredAgents.some(
      (c) => c.agentId === consultant.agentId && c.selected
    );

    return isSelectedInSuggestedSlots || isSelectedInOtherConsultants;
  }

  // Computed properties
  get selectedConsultantsCount(): number {
    return this.allSelectedConsultants.length;
  }

  get allSelectedConsultants(): Consultant[] {
    // Get unique selected consultants from both lists
    const selectedFromSuggested = this.suggestedConsultants.filter(
      (c) => c.selected
    );
    const selectedIds = new Set(selectedFromSuggested.map((c) => c.agentId));

    // Add selected from filtered list only if not already in suggested
    const selectedFromFiltered = this.filteredAgents.filter(
      (c) => c.selected && !selectedIds.has(c.agentId)
    );

    return [...selectedFromSuggested, ...selectedFromFiltered];
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

    // Check if the consultant is already selected elsewhere
    if (this.isConsultantAlreadySelected(consultant)) {
      return; // Exit without selecting if already selected elsewhere
    }

    // Clear any previous consultant in this slot
    const previousConsultant = this.suggestedConsultants[this.currentSlotIndex];
    if (previousConsultant.selected) {
      // Update the corresponding entry in filteredAgents if it exists
      const matchingConsultant = this.filteredAgents.find(
        (c) => c.agentId === previousConsultant.agentId
      );
      if (matchingConsultant) {
        matchingConsultant.selected = false;
        this.updateSelectionMap(matchingConsultant);
      }
    }

    // Mark the new consultant as selected in the filteredAgents list
    const matchingConsultant = this.filteredAgents.find(
      (c) => c.agentId === consultant.agentId
    );
    if (matchingConsultant) {
      matchingConsultant.selected = true;
      this.updateSelectionMap(matchingConsultant);
    }

    // Ensure consultant has all required properties with defaults
    const validConsultant = {
      ...consultant,
      type: consultant.type || 'Consultant',
      description: consultant.description || '',
      creator: {
        name: (consultant.creator && consultant.creator.name) || 'Consultitude',
        avatar:
          (consultant.creator && consultant.creator.avatar) ||
          'images/new/circle.svg',
      },
      likes: consultant.likes || 1,
      icon: consultant.icon || this.getIconForIndex(this.currentSlotIndex),
      profileId: consultant.profileId || '',
      agentId: consultant.agentId || '',
    };

    // Create a new consultant for the slot with the selected consultant's data
    this.suggestedConsultants[this.currentSlotIndex] = {
      ...validConsultant,
      selected: true,
      id: previousConsultant.id, // Keep the UI ID for the slot
    };

    this.updateSelectionMap(this.suggestedConsultants[this.currentSlotIndex]);
    this.updateSelectedConsultantsList();
    this.closeConsultantSelector();
  }
}
