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
  id: string;
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
  @Input() selectedFilters: any[] = []; // Add this input to track selected filters
  @Output() tagClick = new EventEmitter<string>();

  tags: any[] = [];
  selectedImage: string;

  constructor(private router: Router) {
    this.selectedImage = this.getRandomImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.template) {
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

      this.tags = [...areaTags, ...featureTags, ...domainTags];
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
    // Check if the tag has already been selected as a filter
    if (this.isTagDisabled(tag.id)) {
      return; // Prevent further action
    }

    // Emit the tag ID for filtering
    this.tagClick.emit(tag.id);
  }

  isTagDisabled(tagId: string): boolean {
    // Check if the tag is in the list of selected filters
    return this.selectedFilters.some((filter) => filter.id === tagId);
  }
}
