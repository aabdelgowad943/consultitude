import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() filters: any;
  @Input() sections: any;
  @Input() searchText!: string;
  @Output() filterChange = new EventEmitter<void>();
  @Output() searchTextChange = new EventEmitter<string>();
  @Output() toggleSection = new EventEmitter<any>();
  @Output() toggleDomainChildren = new EventEmitter<any>();

  onFilterChange() {
    this.filterChange.emit();
  }
}
