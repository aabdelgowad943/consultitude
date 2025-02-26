import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  @Input() filters: any;
  @Input() sections: any;
  @Input() searchText!: string;
  @Output() filterChange = new EventEmitter<void>();
  @Output() searchTextChange = new EventEmitter<string>();
  @Output() toggleSection = new EventEmitter<any>();
  @Output() toggleDomainChildren = new EventEmitter<any>();

  readonly visibleItems = 4;
  expandedSections: { [key: string]: boolean } = {
    domains: false,
    areasOfFocus: false,
    documentTypes: false,
  };

  onFilterChange() {
    this.filterChange.emit();
  }

  toggleFilter(filter: any) {
    filter.checked = !filter.checked;
    this.filterChange.emit();
  }

  onToggleSection(section: any) {
    this.toggleSection.emit(section);
  }

  onSearchTextChange(searchText: string) {
    this.searchTextChange.emit(searchText);
  }

  onToggleDomainChildren(domain: any) {
    this.toggleDomainChildren.emit(domain);
  }

  toggleExpand(sectionKey: string) {
    this.expandedSections[sectionKey] = !this.expandedSections[sectionKey];
  }

  getVisibleItems(items: any[], sectionKey: string): any[] {
    if (!items) return [];
    return this.expandedSections[sectionKey]
      ? items
      : items.slice(0, this.visibleItems);
  }

  shouldShowMoreButton(items: any[]): boolean {
    return items && items.length > this.visibleItems;
  }
}
