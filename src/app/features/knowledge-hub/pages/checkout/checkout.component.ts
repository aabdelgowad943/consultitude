import { Component } from '@angular/core';
import { PaymentComponent } from './components/payment/payment.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

@Component({
  selector: 'app-checkout',
  imports: [PaymentComponent, ProductDetailsComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  productPrice: number = 0;
}
