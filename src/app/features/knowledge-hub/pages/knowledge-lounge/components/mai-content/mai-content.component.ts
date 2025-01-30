import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductCardComponent } from '../../../../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FormsModule],
  selector: 'app-mai-content',
  templateUrl: './mai-content.component.html',
  styleUrl: './mai-content.component.scss',
})
export class MaiContentComponent {
  @Input() filteredTemplates!: any[];
  @Input() dataLoaded!: boolean;
  @Input() selectedFilters!: any[];
  @Output() clearFilters = new EventEmitter<void>();
  @Output() requestDocument = new EventEmitter<void>();
  @Output() removeFilter = new EventEmitter<any>();

  sortBy: 'asc' | 'desc' = 'asc';
  isFilterOpen = false;
  searchText = '';

  sections = [
    { name: 'Category', key: 'category', isOpen: false },
    { name: 'Price Range', key: 'price', isOpen: false },
  ];

  filters: any = {
    category: [
      { name: 'Category A', checked: false },
      { name: 'Category B', checked: false },
    ],
    price: [
      { name: 'Under $10', checked: false },
      { name: '$10 - $50', checked: false },
    ],
  };

  toggleSort() {
    this.sortBy = this.sortBy === 'asc' ? 'desc' : 'asc';
    this.sortTemplates();
  }

  sortTemplates() {
    this.filteredTemplates.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      return this.sortBy === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
  }

  toggleSection(section: any) {
    section.isOpen = !section.isOpen;
  }

  onFilterChange() {
    console.log('Filters updated:', this.filters);
  }
}
