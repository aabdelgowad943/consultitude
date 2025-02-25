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
  @Output() sortChange = new EventEmitter<string>();
  @Output() openSidebar = new EventEmitter<void>();
  @Output() tagClick = new EventEmitter<string>();

  isSortMenuOpen = false;

  sortOptions: { label: string; value: string }[] = [
    { label: 'Price: Low to High', value: 'priceAsc' },
    { label: 'Price: High to Low', value: 'priceDesc' },
    { label: 'Downloads: High to Low', value: 'downloadsDesc' },
    { label: 'Featured', value: 'featuredFirst' },
  ];

  toggleSortMenu() {
    this.isSortMenuOpen = !this.isSortMenuOpen;
  }

  selectSortOption(option: string) {
    this.isSortMenuOpen = false;
    this.sortChange.emit(option);
  }

  openSidebare() {
    this.openSidebar.emit();
  }
}
