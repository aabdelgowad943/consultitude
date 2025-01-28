import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

export interface ProductItem {
  name: string;
  originalPrice?: number;
  discountedPrice: number;
  isFree?: boolean;
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
export class ProductCardComponent {
  @Input() template: any;

  constructor(private router: Router) {}

  get documentType() {
    return this.template.documentType || 'PDF';
  }

  get language() {
    return this.template.language || 'English';
  }

  get format() {
    return this.template.format || 'Template';
  }

  viewTemplateDetails() {
    this.router.navigate(['/knowledge/view-template-details'], {
      state: { template: this.template },
    });
  }
}
