import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
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
  images = [
    '/images/Pic1.svg',
    '/images/Pic2.svg',
    '/images/Pic3.svg',
    '/images/Pic4.svg',
  ];

  @Input() template: any;
  @Output() tagClick = new EventEmitter<string>();

  tags: any[] = []; // Array to hold combined tags
  selectedImage: string; // Variable to hold the selected image

  constructor(private router: Router) {
    this.selectedImage = this.getRandomImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.template) {
      // Extract names and ids from areaOfFocus, features, and domains
      const areaTags =
        this.template.areaOfFocus?.map((a: any) => ({
          id: a.id,
          name: a.name,
        })) || [];
      const featureTags =
        this.template.features?.map((f: any) => ({ id: f.id, name: f.name })) ||
        [];
      const domainTags =
        this.template.domains?.map((d: any) => ({ id: d.id, name: d.name })) ||
        [];

      // Combine all tags into one array
      this.tags = [...areaTags, ...featureTags, ...domainTags];
      // console.log('domains tage', featureTags);
    }
  }

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
  }

  viewTemplateDetails() {
    this.router.navigate([
      '/knowledge/view-template-details',
      this.template.id,
    ]);
  }

  onTagClick(tag: { id: string; name: string }) {
    this.tagClick.emit(tag.id);
  }
}
