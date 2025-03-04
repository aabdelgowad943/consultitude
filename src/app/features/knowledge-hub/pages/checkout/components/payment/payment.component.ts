import {
  Component,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { AuthService } from '../../../../../auth/services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class PaymentComponent implements AfterViewInit, OnChanges, OnInit {
  @Input() productPrice: number = 0;

  userId: string = localStorage.getItem('userId')!;
  name: string = '';
  email: string = '';
  productId: string = '';

  showError: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  promoCode: string = '';
  discountValue: number = 0;
  totalAmount: number = 0;
  subTotalAmount: number = 0;

  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  paymentElement: any;
  clientSecret: string = '';
  stripePublishableKey: string = 'pk_test_G5bt1644CG8jzK2PPr9mHQYj00hm5lHkLu';

  paymentIntentId: string = '';

  description: string = 'Custom payment';
  loading = false;
  errorPayment: string = '';

  // New property for payment success popup
  showSuccessPopup: boolean = false;

  constructor(
    private location: Location,
    private authService: AuthService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router // Added Router for redirecting if needed
  ) {}

  ngOnInit(): void {
    const templateId = this.route.snapshot.paramMap.get('id');
    this.productId = templateId!;
    this.getProfileDataByUserId();
    this.calculateTotalAmount();
  }

  getProfileDataByUserId() {
    this.authService.getUserDataByUserId(this.userId).subscribe({
      next: (res: any) => {
        this.name = res.data.firstName;
        this.email = res.data.user?.email;
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productPrice']) {
      this.subTotalAmount = this.productPrice;
      this.totalAmount = this.subTotalAmount - this.discountValue;
    }
  }

  async ngAfterViewInit() {
    if (this.userId) {
      // We'll call createPaymentIntent here to ensure we have the clientSecret first
      await this.createPaymentIntent();
    }
  }

  // Initialize Stripe with the client secret from createPaymentIntent
  async initializeStripe() {
    this.stripe = await loadStripe(this.stripePublishableKey);

    if (this.stripe && this.clientSecret) {
      this.elements = this.stripe.elements({
        clientSecret: this.clientSecret,
        appearance: {
          theme: 'stripe',
        },
      });

      // Create and mount the payment element
      this.paymentElement = this.elements.create('payment', {
        paymentMethodOrder: ['card'],
        fields: { billingDetails: { address: 'auto' } },
      });

      this.paymentElement.mount('#payment-element');
    } else {
      this.errorPayment =
        'Failed to initialize payment form. Please try again.';
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    if (!this.stripe || !this.elements) {
      return;
    }

    this.loading = true;
    this.errorPayment = ''; // Clear error when starting new payment attempt

    // Submit the form with the payment element
    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,

      confirmParams: {
        return_url: window.location.origin + '/payment-success',
        payment_method_data: {
          billing_details: {
            email: this.email,
            address: {
              country: 'US',
            },
          },
        },
      },

      redirect: 'if_required',
    });

    if (error) {
      // Show error to your customer
      this.errorPayment = error.message || 'An unexpected error occurred.';
      const paymentError = document.getElementById('payment-error');
      if (paymentError) {
        paymentError.textContent =
          error.message || 'An unexpected error occurred.';
      }
    } else {
      // Payment was successful!
      // Save the payment intent ID
      this.paymentIntentId = paymentIntent?.id || '';

      // Create the order in your system
      this.createOrder();
    }

    this.loading = false;
  }

  goBack() {
    this.location.back();
  }

  // Calculate total amount including any discount from promo code
  calculateTotalAmount() {
    this.paymentService
      .calculateTotalAmount({
        orderDetails: [
          {
            productId: this.productId,
            quantity: 1,
          },
        ],
        voucherCode: this.promoCode,
        taxPercentage: 0,
      })
      .subscribe({
        next: (res: any) => {
          this.totalAmount = res.data.totalAmount;
          this.discountValue = res.data.discount;
          this.subTotalAmount = res.data.subTotalAmount;
        },
        complete: () => {},
      });
  }

  applyPromoCode() {
    this.paymentService
      .applyVoucher({
        code: this.promoCode,
        userId: localStorage.getItem('userId')!,
        productId: this.productId,
      })
      .subscribe({
        next: (res: any) => {
          this.successMessage = res.message;
          this.errorMessage = '';
        },
        complete: () => {
          this.calculateTotalAmount();
          // We should create a new payment intent when a promo code is applied
          this.createPaymentIntent();
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error.errors[0].message;
          this.successMessage = '';
        },
      });
  }

  // Create payment intent with the server
  createPaymentIntent() {
    this.paymentService
      .createPaymentIntent({
        currency: 'usd',
        calculateTotalAmountDto: {
          orderDetails: [
            {
              productId: this.productId,
              quantity: 1,
            },
          ],
          taxPercentage: 0,
          voucherCode: this.promoCode || null!,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.clientSecret = res.clientSecret;
          this.paymentIntentId = res.paymentIntentId;
          // console.log('Payment Intent ID:', this.paymentIntentId);
        },
        complete: () => {
          this.initializeStripe();
        },
        error: (err: HttpErrorResponse) => {
          this.errorPayment =
            err.error.message ||
            'Failed to initialize payment. Please try again.';
        },
      });
  }

  createOrder() {
    this.paymentService
      .createOrder({
        userId: this.userId,
        paymentIntentId: this.paymentIntentId,
        voucherCode: this.promoCode,
        orderDetails: [
          {
            productId: this.productId,
            quantity: 1,
            // price: this.totalAmount,
          },
        ],
      })
      .subscribe({
        next: (res: any) => {
          this.showSuccessPopup = true;
          // this.router.navigate(['/dashboard/documents'], { replaceUrl: true });
        },
        error: (err: HttpErrorResponse) => {
          // console.error('Error creating order:', err);
          this.errorPayment = err.error.message || 'Failed to create order.';
        },
      });
  }

  successPopupAction() {
    this.showSuccessPopup = false;
    this.router.navigate(['/dashboard/documents'], { replaceUrl: true });
  }

  // Close the success popup
  closeSuccessPopup() {
    this.showSuccessPopup = false;
  }

  onPromoCodeInput() {
    if (!this.promoCode) {
      this.errorMessage = '';
    }
  }

  ngOnDestroy() {
    this.paymentElement?.destroy();
  }
}
