import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaiContentComponent } from './components/mai-content/mai-content.component';
import { HeroLoungeSecionComponent } from './components/hero-lounge-secion/hero-lounge-secion.component';
import { ProductStatus } from '../../models/products';
import { Language } from '../../models/language.enum';
import { PaginatorModule } from 'primeng/paginator';
import { SliderModule } from 'primeng/slider';

@Component({
  selector: 'app-knowledge-lounge',
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    MaiContentComponent,
    HeroLoungeSecionComponent,
    PaginatorModule,
    SliderModule,
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
  featuresList: any[] = [];

  // Filters grouped by section – set once after lists load
  filters: any = {};
  sections = [
    { name: 'Domain', key: 'domains', isOpen: false },
    { name: 'Area of Focus', key: 'areasOfFocus', isOpen: false },
    { name: 'Document Format', key: 'documentTypes', isOpen: false },
    // { name: 'Features', key: 'features', isOpen: false },
    { name: 'Price ($) ', key: 'price', isOpen: false },
    // { name: 'Language', key: 'language', isOpen: false },
  ];

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 6; // Use the same value as your paginator rows
  totalPages: number = 1;

  first: number = 0; // Index of the first record
  rows: number = 6; // Number of rows per page (should match pageSize)
  totalRecords: number = 0; // Will be updated from the API response

  // Selected filters (for display)
  selectedFilters: { label: string; value: string; type: string }[] = [];

  constructor(private templateService: ProductServiceService) {}

  ngOnInit(): void {
    // Load filter lists only once
    this.loadAreaOfFocus();
    this.loadDomains();
    this.loadDocuments();
    // this.loadFeatures();
    // Load initial products
    this.loadProducts();
  }

  onSearchChange(searchText: string) {
    this.searchText = searchText;
    this.currentPage = 1;
    this.first = 0; // Reset the first record index
    this.loadProducts();
  }

  onFilterChange() {
    this.currentPage = 1;
    this.first = 0; // Reset the first record index
    this.loadProducts();
  }

  onSortChange(sortOption: any) {
    this.sortBy = sortOption;
    this.currentPage = 1;
    this.first = 0; // Reset the first record index
    this.loadProducts();
  }

  private loadProducts() {
    // Gather selected filters for each filter type
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

    const selectedFeatures = this.featuresList
      .filter((item) => item.checked && item.id)
      .map((item) => ({ label: item.name, value: item.id, type: 'features' }));

    // Add price range filter – defaulting to [0, 1000] if not set
    const [minPrice, maxPrice] = this.filters.price || [0, 1000];

    // Add language filter (assuming a Language enum exists)
    const selectedLanguage = this.filters.language || Language.EN;

    // Store selected filters for display
    this.selectedFilters = [
      ...selectedAreaOfFocus,
      ...selectedDomains,
      ...selectedDocumentTypes,
      ...selectedFeatures,
    ];

    this.dataLoaded = false;
    this.templateService
      .getAllProducts(
        this.currentPage,
        this.pageSize,
        [ProductStatus.ACTIVE],
        selectedLanguage,
        this.searchText,
        this.sortBy,
        selectedAreaOfFocus.map((f) => f.value),
        selectedDomains.map((f) => f.value),
        selectedDocumentTypes.map((f) => f.value),
        selectedFeatures.map((f) => f.value),
        minPrice,
        maxPrice // Pass price range to the API call
      )
      .subscribe({
        next: (response: any) => {
          // Update the products array
          this.templates = response.products;
          this.filteredTemplates = [...this.templates];

          // Update pagination values:
          // If your API returns a totalRecords property, use it.
          if (response.totalRecords) {
            this.totalRecords = response.totalRecords;
          } else {
            // Alternatively, compute totalRecords from totalPages and pageSize.
            this.totalRecords = response.totalPages * this.pageSize;
          }
          // Also update totalPages if provided.
          if (response.totalPages) {
            this.totalPages = response.totalPages;
          }
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
      price: [0, 1000], // Initialize price range
      language: Language.EN, // Initialize language
      features: this.featuresList,
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

  removeFilter(filterToRemove: { label: string; value: string; type: string }) {
    // Remove filter from UI
    this.selectedFilters = this.selectedFilters.filter(
      (f) => f.value !== filterToRemove.value
    );

    // Uncheck the filter in the original list by mutating the item
    if (filterToRemove.type === 'areaOfFocus') {
      const item = this.areaOfFocusList.find(
        (item) => item.id === filterToRemove.value
      );
      if (item) item.checked = false;
    } else if (filterToRemove.type === 'domains') {
      const item = this.domainsList.find(
        (item) => item.id === filterToRemove.value
      );
      if (item) item.checked = false;
    } else if (filterToRemove.type === 'documentTypes') {
      const item = this.documentsList.find(
        (item) => item.id === filterToRemove.value
      );
      if (item) item.checked = false;
    } else if (filterToRemove.type === 'features') {
      const item = this.featuresList.find(
        (item) => item.id === filterToRemove.value
      );
      if (item) item.checked = false;
    }

    // Reload products with updated filters
    this.loadProducts();
  }

  clearAllFilters() {
    for (const section of this.sections) {
      const sectionItems = this.filters[section.key];
      sectionItems.forEach((item: any) => {
        if (typeof item === 'object' && item !== null) {
          item.checked = false;
        } else {
          // console.warn('Unexpected item type', item);
        }
      });
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

  onTagClick(tagId: string) {
    // Find the tag in one of the filter lists
    const tag =
      this.areaOfFocusList.find((item) => item.id === tagId) ||
      this.domainsList.find((item) => item.id === tagId) ||
      this.documentsList.find((item) => item.id === tagId) ||
      this.featuresList.find((item) => item.id === tagId);

    if (tag) {
      tag.checked = true;
      this.selectedFilters.push({
        label: tag.name,
        value: tag.id,
        type: this.getTagType(tagId),
      });
      this.currentPage = 1;
      this.first = 0; // Reset the first record index
      this.loadProducts();
    }
  }

  private getTagType(tagId: string): string {
    if (this.areaOfFocusList.some((item) => item.id === tagId))
      return 'areaOfFocus';
    if (this.domainsList.some((item) => item.id === tagId)) return 'domains';
    if (this.documentsList.some((item) => item.id === tagId))
      return 'documentTypes';
    if (this.featuresList.some((item) => item.id === tagId)) return 'features';
    return '';
  }

  // Handle page change events from the paginator
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.currentPage = event.page + 1;
    this.loadProducts();
    // scroll to top
    window.scrollTo(0, 0);
  }

  validatePriceRange() {
    // Make sure min doesn't exceed max
    if (this.filters.price[0] > this.filters.price[1]) {
      this.filters.price[0] = this.filters.price[1];
    }
  }
}
