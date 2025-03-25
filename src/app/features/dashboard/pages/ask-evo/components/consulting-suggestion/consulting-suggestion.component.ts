import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-consulting-suggestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consulting-suggestion.component.html',
  styleUrl: './consulting-suggestion.component.scss',
})
export class ConsultingSuggestionComponent implements OnInit {
  @Input() suggestedAgents: any[] = []; // Input to receive agents from parent component
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() selectedConsultantsChange = new EventEmitter<Consultant[]>();

  private readonly maxSelectedConsultants = 3;

  suggestedConsultants: Consultant[] = [];
  otherConsultants: Consultant[] = [];

  currentPage = 1;
  itemsPerPage = 6;

  ngOnInit() {
    // Transform input suggested agents into Consultant format
    if (this.suggestedAgents && this.suggestedAgents.length > 0) {
      this.suggestedConsultants = this.suggestedAgents
        .slice(0, 3)
        .map((agent, index) => ({
          id: index + 1,
          type: agent.name || 'Consultant',
          description: `${agent.persona} in ${agent.domain} located in ${agent.location}`,
          creator: {
            name: agent.name || 'Consultitude',
            avatar: 'images/new/circle.svg',
          },
          likes: 1,
          icon: this.getIconForIndex(index),
          selected: true,
          profileId: agent.profileId,
          agentId: agent.agentId,
        }));

      // If more than 3 agents, put the rest in otherConsultants
      if (this.suggestedAgents.length > 3) {
        this.otherConsultants = this.suggestedAgents
          .slice(3)
          .map((agent, index) => ({
            id: index + 4,
            type: agent.name || 'Consultant',
            description: `${agent.persona} in ${agent.domain} located in ${agent.location}`,
            creator: {
              name: agent.name || 'Consultitude',
              avatar: 'images/new/circle.svg',
            },
            likes: 1,
            icon: this.getIconForIndex(index),
            selected: false,
            profileId: agent.profileId,
            agentId: agent.agentId,
          }));
      }
    }
  }

  // Helper method to assign different icons
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

  // Existing methods remain the same as in the previous implementation
  get selectedConsultantsCount(): number {
    const suggestedSelected = this.suggestedConsultants.filter(
      (c) => c.selected
    ).length;
    const otherSelected = this.otherConsultants.filter(
      (c) => c.selected
    ).length;
    return suggestedSelected + otherSelected;
  }

  get totalConsultantsCount(): number {
    return this.suggestedConsultants.length + this.otherConsultants.length;
  }

  get allSelectedConsultants(): Consultant[] {
    const selectedFromSuggested = this.suggestedConsultants.filter(
      (c) => c.selected
    );
    const selectedFromOther = this.otherConsultants.filter((c) => c.selected);
    return [...selectedFromSuggested, ...selectedFromOther];
  }

  get paginatedConsultants() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.otherConsultants.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  get totalPages() {
    return Math.ceil(this.otherConsultants.length / this.itemsPerPage);
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
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPreviousStep() {
    this.previous.emit();
  }

  continueToNextStep() {
    this.selectedConsultantsChange.emit(this.allSelectedConsultants);
    this.continue.emit();
  }
}
