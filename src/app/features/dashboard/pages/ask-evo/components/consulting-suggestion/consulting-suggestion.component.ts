import { Component, EventEmitter, Output } from '@angular/core';
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
}

@Component({
  selector: 'app-consulting-suggestion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './consulting-suggestion.component.html',
  styleUrl: './consulting-suggestion.component.scss',
})
export class ConsultingSuggestionComponent {
  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() selectedConsultantsChange = new EventEmitter<Consultant[]>();

  suggestedConsultants: Consultant[] = [
    {
      id: 1,
      type: 'Customer Support Consultant',
      description:
        'Designed to resolve sensitive issues efficiently while ensuring a positive customer experience',
      creator: {
        name: 'Consultitude',
        avatar: 'images/new/circle.svg',
      },
      likes: 1,
      icon: 'pi-comments',
      selected: true,
    },
    {
      id: 2,
      type: 'Customer Support Consultant',
      description:
        'Designed to resolve sensitive issues efficiently while ensuring a positive customer experience',
      creator: {
        name: 'Consultitude',
        avatar: 'images/new/circle.svg',
      },
      likes: 1,
      icon: 'pi-user',
      selected: true,
    },
    {
      id: 3,
      type: 'Customer Support Consultant',
      description:
        'Designed to resolve sensitive issues efficiently while ensuring a positive customer experience',
      creator: {
        name: 'Consultitude',
        avatar: 'images/new/circle.svg',
      },
      likes: 1,
      icon: 'pi-clock',
      selected: true,
    },
  ];

  otherConsultants: Consultant[] = [
    {
      id: 4,
      type: 'Customer Support Consultant',
      description:
        'Designed to resolve sensitive issues efficiently while ensuring a positive customer experience',
      creator: {
        name: 'Consultitude',
        avatar: 'images/new/circle.svg',
      },
      likes: 1,
      icon: 'pi-comments',
      selected: false,
    },
    // ... other consultants remain the same
  ];

  currentPage = 1;
  itemsPerPage = 6;

  // Get total selected consultants count
  get selectedConsultantsCount(): number {
    const suggestedSelected = this.suggestedConsultants.filter(
      (c) => c.selected
    ).length;
    const otherSelected = this.otherConsultants.filter(
      (c) => c.selected
    ).length;
    return suggestedSelected + otherSelected;
  }

  // Get total consultants count
  get totalConsultantsCount(): number {
    return this.suggestedConsultants.length + this.otherConsultants.length;
  }

  // Get all selected consultants
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

  // Toggle selection for suggested consultants
  toggleSuggestedSelection(consultant: Consultant) {
    consultant.selected = !consultant.selected;
    this.selectedConsultantsChange.emit(this.allSelectedConsultants);
  }

  // Toggle selection for other consultants
  toggleOtherSelection(consultant: Consultant) {
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
