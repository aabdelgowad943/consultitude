import { Component, OnInit } from '@angular/core';
import { ProductServiceService } from '../../services/product-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MaiContentComponent } from './components/mai-content/mai-content.component';
import { HeroLoungeSecionComponent } from './components/hero-lounge-secion/hero-lounge-secion.component';

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
  onSearchChange(searchText: string) {
    this.searchText = searchText;
    this.filterTemplates();
  }

  filterTemplates(): void {
    this.filteredTemplates = this.templates.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      const filterMappings = {
        domains: 'domain',
        areasOfFocus: 'areaOfFocus',
        languages: 'language',
        documentTypes: 'documentType',
        prices: 'price',
        formats: 'format',
      };

      let matchesFilters = true;
      for (const [filterKey, itemKey] of Object.entries(filterMappings)) {
        const activeFilters = this.filters[filterKey].filter(
          (f: any) => f.checked
        );
        if (activeFilters.length > 0) {
          matchesFilters = activeFilters.some(
            (f: any) => f.name === item[itemKey]
          );
          if (!matchesFilters) break;
        }
      }

      return matchesSearch && matchesFilters;
    });
  }

  onFilterChange() {
    this.filterTemplates();
  }

  ngOnInit(): void {
    this.templateService.getTemplates().subscribe((data: any) => {
      this.templates = data.products.flatMap(
        (product: { items: any }) => product.items
      );
      this.filteredTemplates = [...this.templates];
      this.dataLoaded = true;
    });
  }

  ngOnChanges(): void {
    this.filterTemplates();
  }

  filters: any = {
    domains: [
      {
        name: 'Strategy',
        checked: false,
      },
      {
        name: 'Delivery',
        checked: false,
      },
      {
        name: 'Digital',
        checked: false,
      },
    ],
    areasOfFocus: [
      { name: 'Technology', checked: false },
      { name: 'Healthcare', checked: false },
      { name: 'Finance', checked: false },
    ],
    languages: [
      { name: 'English', checked: false },
      { name: 'Spanish', checked: false },
      { name: 'Mandarin', checked: false },
    ],
    documentTypes: [
      { name: 'PDF', checked: false },
      { name: 'Word', checked: false },
      { name: 'Excel', checked: false },
    ],
    prices: [
      { name: 'Free', checked: false },
      { name: 'Paid', checked: false },
    ],
    formats: [
      { name: 'Template', checked: false },
      { name: 'Guide', checked: false },
      { name: 'Case Study', checked: false },
    ],
  };

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
