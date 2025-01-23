import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

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
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent implements OnInit {
  @Input() template: any;
  ngOnInit(): void {
    console.log(this.template);
  }
}
