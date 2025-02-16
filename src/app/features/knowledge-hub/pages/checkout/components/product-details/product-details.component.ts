import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductServiceService } from '../../../../services/product-service.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  @Output() priceChange = new EventEmitter<number>();
  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.fetchProductById(productId);
    }
  }

  private fetchProductById(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
        this.product = response.data;
        this.priceChange.emit(this.product.price);
        // console.log('res is', response.data);
      },
      error: (err) => console.error('Error fetching product:', err),
    });
  }
}
