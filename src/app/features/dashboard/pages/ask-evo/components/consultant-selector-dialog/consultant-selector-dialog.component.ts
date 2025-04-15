import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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
  selector: 'app-consultant-selector-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultant-selector-dialog.component.html',
  styleUrl: './consultant-selector-dialog.component.scss',
})
export class ConsultantSelectorDialogComponent implements OnInit {
  consultants: Consultant[] = [];

  // Filtering and pagination properties
  searchTerm: string = '';
  filteredConsultants: Consultant[] = [];
  activeFilter: 'all' | 'byme' | 'consultitude' = 'all';
  showFilterDropdown = false;

  // Pagination properties
  currentPage = 1;
  itemsPerPage = 6;
  totalPages = 0;

  constructor(
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig
  ) {}

  ngOnInit() {
    // Get consultants from dialog config
    this.consultants = this.dialogConfig.data?.consultants || [];
    this.filteredConsultants = [...this.consultants];
    this.updatePagination();
  }

  // Filtering methods
  filterAgents(filter: 'all' | 'byme' | 'consultitude') {
    this.activeFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
  }

  searchConsultants() {
    this.currentPage = 1;
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = [...this.consultants];

    // Search filter
    if (this.searchTerm) {
      const searchTerm = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (consultant) =>
          consultant.type.toLowerCase().includes(searchTerm) ||
          consultant.description.toLowerCase().includes(searchTerm)
      );
    }

    // Type filter
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter((consultant) => {
        if (this.activeFilter === 'byme') {
          return consultant.creator.name === 'By me';
        }
        if (this.activeFilter === 'consultitude') {
          return consultant.creator.name === 'Consultitude';
        }
        return true;
      });
    }

    this.filteredConsultants = filtered;
    this.updatePagination();
  }

  private updatePagination() {
    this.totalPages = Math.ceil(
      this.filteredConsultants.length / this.itemsPerPage
    );
  }

  // Pagination methods
  getPaginatedConsultants(): Consultant[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredConsultants.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
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

  toggleFilterDropdown() {
    this.showFilterDropdown = !this.showFilterDropdown;
  }

  selectConsultant(consultant: Consultant) {
    this.dialogRef.close(consultant);
  }

  closeDialog() {
    this.dialogRef.close();
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
}
