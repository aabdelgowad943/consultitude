import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AgentsService,
  AgentFilterParams,
} from '../../../../services/agents.service';

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
  imports: [CommonModule],
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
  otherConsultants: Consultant[] = [];

  currentPage = 1;
  itemsPerPage = 6;
  totalItems = 0;
  isLoading = false; // Add loading state
  error: string | null = null; // Add error state

  constructor(private agentService: AgentsService) {}

  ngOnInit() {
    this.initializeSuggestedConsultants();
    this.fetchOtherConsultants();
  }

  // private initializeSuggestedConsultants() {
  //   if (this.suggestedAgents && this.suggestedAgents.length > 0) {
  //     this.suggestedConsultants = this.suggestedAgents
  //       .slice(0, 3)
  //       .map((agent, index) => ({
  //         id: index + 1,
  //         type: agent.name || 'Consultant',
  //         description: agent.persona,
  //         creator: {
  //           name: agent.name || 'Consultitude',
  //           avatar: 'images/new/circle.svg',
  //         },
  //         likes: 1,
  //         icon: this.getIconForIndex(index),
  //         selected: true,
  //         profileId: agent.profileId,
  //         agentId: agent.agentId,
  //       }));
  //   }
  // }

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

  private fetchOtherConsultants() {
    this.isLoading = true;
    this.error = null;

    const params: AgentFilterParams = {
      page: this.currentPage,
      limit: this.itemsPerPage,
    };

    this.agentService.getAllAgents(params).subscribe({
      next: (response: any) => {
        if (response.success && Array.isArray(response.data)) {
          this.otherConsultants = response.data.map(
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
                selected: false, // Default to false
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

  get selectedConsultantsCount(): number {
    return (
      this.suggestedConsultants.filter((c) => c.selected).length +
      this.otherConsultants.filter((c) => c.selected).length
    );
  }

  get totalConsultantsCount(): number {
    return this.totalItems;
  }

  get paginatedConsultants() {
    return this.otherConsultants; // Already paginated by API
  }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  toggleSuggestedSelection(consultant: Consultant) {
    if (
      !consultant.selected &&
      this.selectedConsultantsCount >= this.maxSelectedConsultants
    ) {
      return;
    }
    consultant.selected = !consultant.selected;
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
    this.selectedConsultantsChange.emit(this.allSelectedConsultants);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchOtherConsultants();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchOtherConsultants();
    }
  }

  goToPreviousStep() {
    this.previous.emit();
  }

  continueToNextStep() {
    this.selectedConsultantsChange.emit(this.allSelectedConsultants);
    this.continue.emit();
  }

  get allSelectedConsultants(): Consultant[] {
    return [
      ...this.suggestedConsultants.filter((c) => c.selected),
      ...this.otherConsultants.filter((c) => c.selected),
    ];
  }
}
