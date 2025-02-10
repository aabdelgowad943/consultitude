import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaiContentComponent } from './components/mai-content/mai-content.component';
import { HeroLoungeSecionComponent } from './components/hero-lounge-secion/hero-lounge-secion.component';
import { Product, ProductStatus } from '../../models/products';

@Component({
  selector: 'app-knowledge-lounge',
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    MaiContentComponent,
    HeroLoungeSecionComponent,
  ],
  templateUrl: './knowledge-lounge.component.html',
  styleUrls: ['./knowledge-lounge.component.scss'],
})
export class KnowledgeLoungeComponent implements OnInit {
  // UI state
  isFilterOpen: boolean = false;
  isSidebarOpen: boolean = false;
  dataLoaded: boolean = false;

  // Product arrays
  templates: any[] = [];
  filteredTemplates: any[] = [];

  // Search, sort and filter
  searchText: string = '';
  sortBy: string = 'priceAsc'; // Default sort option

  // Filter lists (populated from API)
  areaOfFocusList: any[] = [];
  domainsList: any[] = [];
  documentsList: any[] = [];
  price: any[] = [];

  // Filters grouped by section – set once after lists load
  filters: any = {};
  sections = [
    { name: 'Domain', key: 'domains', isOpen: false },
    { name: 'Area of Focus', key: 'areasOfFocus', isOpen: false },
    { name: 'Document Format', key: 'documentTypes', isOpen: false },
    { name: 'Price', key: 'price', isOpen: false },
    { name: 'Language', key: 'language', isOpen: false },
  ];

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;

  constructor(private templateService: ProductServiceService) {}

  ngOnInit(): void {
    // Load filter lists only once
    this.loadAreaOfFocus();
    this.loadDomains();
    this.loadDocuments();
    // Load initial products
    this.loadProducts();
  }

  onSearchChange(searchText: string) {
    this.searchText = searchText;
    this.currentPage = 1;
    this.loadProducts();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  onSortChange(sortOption: string) {
    this.sortBy = sortOption;
    this.currentPage = 1;
    this.loadProducts();
  }

  selectedFilters: { label: string; value: string; type: string }[] = [];

  private loadProducts() {
    // Gather selected filters
    const selectedAreaOfFocus = this.areaOfFocusList
      .filter((item) => item.checked && item.id)
      .map((item) => ({
        label: item.name,
        value: item.id,
        type: 'areaOfFocus',
      }));

    const selectedDomains = this.domainsList
      .filter((item) => item.checked && item.id)
      .map((item) => ({ label: item.name, value: item.id, type: 'domains' }));

    const selectedDocumentTypes = this.documentsList
      .filter((item) => item.checked && item.id)
      .map((item) => ({
        label: item.name,
        value: item.id,
        type: 'documentTypes',
      }));

    // Add price range filter
    const [minPrice, maxPrice] = this.filters.price || [0, 10000];

    // Store selected filters for display
    this.selectedFilters = [
      ...selectedAreaOfFocus,
      ...selectedDomains,
      ...selectedDocumentTypes,
    ];

    // console.log('Selected Filters:', this.selectedFilters);

    this.dataLoaded = false;
    this.templateService
      .getAllProducts(
        this.currentPage,
        this.pageSize,
        [ProductStatus.ACTIVE],
        'EN',
        this.searchText,
        this.sortBy,
        selectedAreaOfFocus.map((f) => f.value),
        selectedDomains.map((f) => f.value),
        selectedDocumentTypes.map((f) => f.value),
        minPrice,
        maxPrice // Pass price range to the API call
      )
      .subscribe({
        next: (response) => {
          this.templates = response.products;
          this.filteredTemplates = [...this.templates];
          this.totalPages = response.totalPages;
          // console.log('Total Pages:', this.totalPages);
          this.dataLoaded = true;
        },
        error: (err) => {
          console.error('Error fetching products', err);
          this.dataLoaded = true;
        },
      });
  }

  private loadAreaOfFocus() {
    this.templateService.getAllAreaFocus().subscribe({
      next: (data) => {
        this.areaOfFocusList = data;
        this.initializeFilters();
      },
    });
  }

  private loadDomains() {
    this.templateService.getAllDomains().subscribe({
      next: (data) => {
        this.domainsList = data;
        this.initializeFilters();
      },
    });
  }

  private loadDocuments() {
    this.templateService.getAllDocumentTypes().subscribe({
      next: (data: any) => {
        this.documentsList = data;
        this.initializeFilters();
      },
    });
  }

  // Initialize filters only once after the lists load.
  private initializeFilters() {
    this.filters = {
      domains: this.domainsList,
      areasOfFocus: this.areaOfFocusList,
      documentTypes: this.documentsList,
      price: [0, 10000], // Initialize price range
      language: 'EN', // Initialize language
    };
  }

  toggleSection(section: any) {
    section.isOpen = !section.isOpen;
  }

  toggleDomainChildren(domain: any) {
    if (domain.children) {
      domain.children.forEach((child: any) => (child.checked = domain.checked));
    }
  }

  // Pagination controls
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  removeFilter(filterToRemove: { label: string; value: string; type: string }) {
    // Remove filter from UI
    this.selectedFilters = this.selectedFilters.filter(
      (f) => f.value !== filterToRemove.value
    );

    // Uncheck the filter in the original list
    if (filterToRemove.type === 'areaOfFocus') {
      this.areaOfFocusList = this.areaOfFocusList.map((item) =>
        item.id === filterToRemove.value ? { ...item, checked: false } : item
      );
    } else if (filterToRemove.type === 'domains') {
      this.domainsList = this.domainsList.map((item) =>
        item.id === filterToRemove.value ? { ...item, checked: false } : item
      );
    } else if (filterToRemove.type === 'documentTypes') {
      this.documentsList = this.documentsList.map((item) =>
        item.id === filterToRemove.value ? { ...item, checked: false } : item
      );
    }

    // Reload products with updated filters
    this.loadProducts();
  }

  clearAllFilters() {
    for (const section of this.sections) {
      const sectionItems = this.filters[section.key];
      sectionItems.forEach(
        (item: { checked: boolean }) => (item.checked = false)
      );
    }
    this.onFilterChange();
  }

  clearFilters() {
    this.clearAllFilters();
  }

  openFilterModal() {
    this.isFilterOpen = true;
  }

  closeFilterModal() {
    this.isFilterOpen = false;
  }

  openSidebar() {
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
