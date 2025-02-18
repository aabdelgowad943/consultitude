import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaiContentComponent } from './components/mai-content/mai-content.component';
import { HeroLoungeSecionComponent } from './components/hero-lounge-secion/hero-lounge-secion.component';
import { Product, ProductStatus } from '../../models/products';
import { Language } from '../../models/language.enum';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-knowledge-lounge',
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    MaiContentComponent,
    HeroLoungeSecionComponent,
    PaginatorModule,
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
    { name: 'Price', key: 'price', isOpen: false },
    // { name: 'Language', key: 'language', isOpen: false },
  ];

  // Pagination variables
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;

  first: number = 0; // Index of the first record
  rows: number = 6; // Number of rows per page
  totalRecords: number = 120; // Total number of records (update as needed)

  // Optional: if you want to keep track of a 1-indexed current page

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

    const selectedFeatures = this.featuresList
      .filter((item) => item.checked && item.id)
      .map((item) => ({ label: item.name, value: item.id, type: 'features' }));

    // Add price range filter
    const [minPrice, maxPrice] = this.filters.price || [0, 1000];

    // Add language filter
    const selectedLanguage = this.filters.language || Language.EN;

    // Store selected filters for display
    this.selectedFilters = [
      ...selectedAreaOfFocus,
      ...selectedDomains,
      ...selectedDocumentTypes,
      ...selectedFeatures,
    ];

    // console.log('Selected Filters:', this.selectedFilters);

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

  // private loadFeatures() {
  //   this.templateService.getAllFeatures().subscribe({
  //     next: (data) => {
  //       this.featuresList = data;
  //       this.initializeFilters();
  //     },
  //   });
  // }

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

  onTagClick(tagId: string) {
    // Find the tag in the areaOfFocusList, domainsList, documentsList, or featuresList
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

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    // event.page is zero-based, so add 1 if you need a 1-indexed page number
    this.currentPage = event.page + 1;

    // Fetch new products based on the current page and rows per page
    this.loadProducts();
  }
}
