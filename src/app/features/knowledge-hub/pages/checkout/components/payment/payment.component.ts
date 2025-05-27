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
  validatedPromoCode: string = ''; // This will store the validated promo code
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

  // To track payment status
  paymentProcessed: boolean = false;

  constructor(
    private location: Location,
    private authService: AuthService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
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
      await this.createPaymentIntent();
    }
  }

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

    // Prevent double submissions/multiple payments
    if (this.paymentProcessed) {
      this.errorPayment =
        'This payment has already been processed. Please refresh the page to make a new payment.';
      return;
    }

    this.loading = true;
    this.errorPayment = ''; // Clear error when starting new payment attempt

    try {
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
        // Check for specific error cases
        if (error.code === 'payment_intent_unexpected_state') {
          this.errorPayment =
            'This payment has already been processed successfully.';
          this.paymentProcessed = true;
          // Show success popup since payment was already successful
          this.showSuccessPopup = true;
        } else {
          // Show general error to customer
          this.errorPayment = error.message || 'An unexpected error occurred.';
        }
      } else {
        // Payment was successful!
        this.paymentIntentId = paymentIntent?.id || '';
        this.paymentProcessed = true;
        // Create the order in your system
        this.createOrder();
      }
    } catch (err: any) {
      this.errorPayment =
        err.message ||
        'An unexpected error occurred during payment processing.';
    } finally {
      this.loading = false;
    }
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
        voucherCode: this.validatedPromoCode, // Use validated promo code instead
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
    if (this.promoCode === '') {
      this.errorMessage = 'Voucher code should not be empty';
      return;
    }

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
          // Only set the validated promo code when it's successfully applied
          this.validatedPromoCode = this.promoCode;
        },
        complete: () => {
          this.calculateTotalAmount();
          // Create a new payment intent with the applied promo code
          this.createPaymentIntent();
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error.errors[0].message;
          this.successMessage = '';
          // Clear the validated promo code if there's an error
          this.validatedPromoCode = '';
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
          voucherCode: this.validatedPromoCode || null!, // Use validated promo code
        },
      })
      .subscribe({
        next: (res: any) => {
          this.clientSecret = res.clientSecret;
          this.paymentIntentId = res.paymentIntentId;
        },
        complete: () => {
          this.initializeStripe();
        },
        error: (err) => {
          this.errorPayment =
            err.error[0].message ||
            'Failed to initialize payment. Please try again.';
        },
      });
  }

  createOrder() {
    this.paymentService
      .createOrder({
        userId: this.userId,
        paymentIntentId: this.paymentIntentId,
        voucherCode: this.validatedPromoCode, // Use validated promo code
        orderDetails: [
          {
            productId: this.productId,
            quantity: 1,
          },
        ],
      })
      .subscribe({
        next: (res: any) => {
          this.showSuccessPopup = true;
        },
        error: (err) => {
          this.errorPayment = err.error[0].message || 'Failed to create order.';
        },
      });
  }

  successPopupAction() {
    this.showSuccessPopup = false;
    this.router.navigate(['/dashboard/documents'], { replaceUrl: true });
  }

  closeSuccessPopup() {
    this.showSuccessPopup = false;
  }

  onPromoCodeInput() {
    if (!this.promoCode) {
      this.errorMessage = '';
    }
    // Don't clear validatedPromoCode here - it should only be set when Apply is clicked
  }

  clearPromoCode() {
    this.promoCode = '';
    this.validatedPromoCode = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.calculateTotalAmount();
    this.createPaymentIntent();
  }

  ngOnDestroy() {
    this.paymentElement?.destroy();
  }
}
