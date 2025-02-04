import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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

  constructor(private router: Router) {}
  ngOnChanges(changes: SimpleChanges): void {}

  viewTemplateDetails() {
    this.router.navigate([
      '/knowledge/view-template-details',
      this.template.id,
    ]);
  }
}
