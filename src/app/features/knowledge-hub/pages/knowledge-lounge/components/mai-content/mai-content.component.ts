import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ProductCardComponent } from '../../../../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../../../services/product-service.service';
import {
  LanguageCode,
  Product,
  ProductStatus,
} from '../../../../models/products';

@Component({
  standalone: true,
  imports: [CommonModule, ProductCardComponent, FormsModule],
  selector: 'app-mai-content',
  templateUrl: './mai-content.component.html',
  styleUrl: './mai-content.component.scss',
})
export class MaiContentComponent implements OnInit {
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

  constructor(private productService: ProductServiceService) {}
  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.productService
      .getAllProducts(1, 10, [ProductStatus.ACTIVE], 'EN')
      .subscribe({
        next: (res: Product[]) => {
          console.log('Products:', res);
        },
        error: (err) => {
          console.error('Error fetching products:', err);
        },
      });
  }

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
