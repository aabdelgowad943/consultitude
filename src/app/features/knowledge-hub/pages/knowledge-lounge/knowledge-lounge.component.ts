import { Component } from '@angular/core';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { ProductServiceService } from '../../services/product-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-knowledge-lounge',
  imports: [ProductCardComponent, FormsModule, CommonModule],
  templateUrl: './knowledge-lounge.component.html',
  styleUrl: './knowledge-lounge.component.scss',
})
export class KnowledgeLoungeComponent {
  templates: any[] = [];
  filteredTemplates: any[] = [];
  searchText: string = '';

  constructor(private templateService: ProductServiceService) {}

  ngOnInit(): void {
    this.templateService.getTemplates().subscribe((data) => {
      this.templates = data;
      this.filteredTemplates = data;
      console.log('dd', this.templates);
    });
  }

  ngOnChanges(): void {
    this.filterTemplates();
  }

  filterTemplates(): void {
    this.filteredTemplates = this.templates.filter((template) =>
      template.title.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
