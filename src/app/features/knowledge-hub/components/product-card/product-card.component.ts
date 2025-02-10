import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

export interface ProductItem {
  name: string;
  originalPrice?: number;
  discountedPrice: number;
  isFree?: boolean;
  id: string; // Add ID property
}

export interface Product {
  title: string;
  items: ProductItem[];
}
@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnChanges {
  @Input() template: any;

  tags: string[] = []; // Array to hold combined tags

  constructor(private router: Router) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.template) {
      // Extract names from areaOfFocus, features, and domains
      const areaTags = this.template.areaOfFocus?.map((a: any) => a.name) || [];
      const featureTags = this.template.features?.map((f: any) => f.name) || [];
      const domainTags = this.template.domains?.map((d: any) => d.name) || [];

      // Combine all tags into one array
      this.tags = [...areaTags, ...featureTags, ...domainTags];
    }
  }

  viewTemplateDetails() {
    this.router.navigate([
      '/knowledge/view-template-details',
      this.template.id,
    ]);
  }
}
