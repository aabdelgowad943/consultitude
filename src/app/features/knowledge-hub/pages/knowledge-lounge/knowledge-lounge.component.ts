import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaiContentComponent } from './components/mai-content/mai-content.component';
import { HeroLoungeSecionComponent } from './components/hero-lounge-secion/hero-lounge-secion.component';
import { Product, ProductStatus } from '../../models/products';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

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
  isFilterOpen: boolean = false;
  isSidebarOpen: boolean = false;
  templates: any[] = [];
  filteredTemplates: any[] = [];
  searchText: string = '';
  dataLoaded: boolean = false;

  constructor(private templateService: ProductServiceService) {}
  ngOnInit(): void {
    this.loadProducts();
  }
  onSearchChange(searchText: string) {
    this.searchText = searchText;
    this.filterTemplates();
  }

  onFilterChange() {
    this.filterTemplates();
  }

  private loadProducts() {
    this.templateService
      .getAllProducts(1, 10, [ProductStatus.ACTIVE], 'EN')
      .subscribe({
        next: (products: Product[]) => {
          this.templates = products;
          this.filteredTemplates = [...this.templates];
          this.initializeFilters();
          this.dataLoaded = true;
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.dataLoaded = true;
        },
      });
  }

  private initializeFilters() {
    // Initialize filters based on API response data
    this.filters = {
      domains: this.getUniqueValues('domains', 'name'),
      areasOfFocus: this.getUniqueValues('areaOfFocus', 'name'),
      languages: this.getUniqueDocumentValues('language'),
      documentTypes: this.getUniqueDocumentValues('documentFormat'),
      prices: [
        { name: 'Free', checked: false, value: 0 },
        { name: 'Paid', checked: false, value: 1 },
      ],
      formats: this.getUniqueValues('features', 'name'),
    };
  }

  private getUniqueValues(arrayName: string, property: string): any[] {
    const uniqueItems = new Set<string>();
    this.templates.forEach((product) => {
      product[arrayName]?.forEach((item: any) => {
        uniqueItems.add(item[property]);
      });
    });
    return Array.from(uniqueItems).map((name) => ({ name, checked: false }));
  }

  private getUniqueDocumentValues(property: string): any[] {
    const uniqueItems = new Set<string>();
    this.templates.forEach((product) => {
      product.documents?.forEach((doc: any) => {
        uniqueItems.add(doc[property]);
      });
    });
    return Array.from(uniqueItems).map((name) => ({ name, checked: false }));
  }

  filterTemplates(): void {
    this.filteredTemplates = this.templates.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      const filterConditions = {
        domains: (product: Product) =>
          this.checkArrayFilter(product.domains, 'name', 'domains'),
        areasOfFocus: (product: Product) =>
          this.checkArrayFilter(product.areaOfFocus, 'name', 'areasOfFocus'),
        languages: (product: Product) =>
          this.checkDocumentFilter(product.documents, 'language', 'languages'),
        documentTypes: (product: Product) =>
          this.checkDocumentFilter(
            product.documents,
            'documentFormat',
            'documentTypes'
          ),
        prices: (product: Product) => this.checkPriceFilter(product.price),
        formats: (product: Product) =>
          this.checkArrayFilter(product.features, 'name', 'formats'),
      };

      const matchesFilters = Object.values(filterConditions).every(
        (condition) => condition(product)
      );

      return matchesSearch && matchesFilters;
    });
  }

  private checkArrayFilter(
    items: any[],
    itemProperty: string,
    filterKey: string
  ): boolean {
    const activeFilters = this.filters[filterKey].filter((f: any) => f.checked);
    if (activeFilters.length === 0) return true;

    return items.some((item) =>
      activeFilters.some(
        (filter: { name: any }) => filter.name === item[itemProperty]
      )
    );
  }

  private checkDocumentFilter(
    documents: any[],
    docProperty: string,
    filterKey: string
  ): boolean {
    const activeFilters = this.filters[filterKey].filter((f: any) => f.checked);
    if (activeFilters.length === 0) return true;

    return documents.some((doc) =>
      activeFilters.some(
        (filter: { name: any }) => filter.name === doc[docProperty]
      )
    );
  }

  private checkPriceFilter(price: number): boolean {
    const activeFilters = this.filters.prices.filter((f: any) => f.checked);
    if (activeFilters.length === 0) return true;

    return activeFilters.some((filter: { name: string }) =>
      filter.name === 'Free' ? price === 0 : price > 0
    );
  }

  ngOnChanges(): void {
    this.filterTemplates();
  }

  filters: any = {};

  sections = [
    {
      name: 'Domain',
      key: 'domains',
      isOpen: true,
    },
    {
      name: 'Area of Focus',
      key: 'areasOfFocus',
      isOpen: false,
    },
    {
      name: 'Language',
      key: 'languages',
      isOpen: false,
    },
    {
      name: 'Document Type',
      key: 'documentTypes',
      isOpen: false,
    },
    {
      name: 'Price',
      key: 'prices',
      isOpen: false,
    },
    {
      name: 'Document Format',
      key: 'formats',
      isOpen: false,
    },
  ];

  toggleSection(section: any) {
    section.isOpen = !section.isOpen;
  }

  toggleDomainChildren(domain: any) {
    domain.children.forEach((child: any) => (child.checked = domain.checked));
  }

  get selectedFilters() {
    const filters = [];
    for (const section of this.sections) {
      const sectionItems = this.filters[section.key];
      for (const item of sectionItems) {
        if (item.checked) {
          filters.push({
            section: section.name,
            name: item.name,
            key: section.key,
            item: item,
          });
        }
      }
    }
    return filters;
  }

  removeFilter(filter: any) {
    filter.item.checked = false;
    this.onFilterChange();
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

  requestDocument() {}
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
