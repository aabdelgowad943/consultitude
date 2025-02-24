import {
  Component,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { AuthService } from '../../../../../auth/services/auth.service';
import { PaymentService } from '../../services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  card: any;
  clientSecret: string = '';
  stripePublishableKey: string =
    'pk_test_51M2CsDLiXG1Mixu3zo3pn3Br9yVaW7XhScQQEnJHlSyDv9dBSBouSMudRBPyHgYsgdDgxvbGZpgGhZK4pIGfAupH00yNITHpax';

  description: string = 'Custom payment';
  loading = false;
  error = '';

  constructor(
    private location: Location,
    private authService: AuthService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const templateId = this.route.snapshot.paramMap.get('id');
    this.productId = templateId!;
    this.getProfileDataByUserId();
    this.createPaymentIntent();
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
      await this.initializeStripe();
    }
  }

  // --------------------------------stripe------------------------------------------
  async initializeStripe() {
    this.stripe = await loadStripe(
      'pk_test_51M2CsDLiXG1Mixu3zo3pn3Br9yVaW7XhScQQEnJHlSyDv9dBSBouSMudRBPyHgYsgdDgxvbGZpgGhZK4pIGfAupH00yNITHpax'
    );
    if (this.stripe) {
      this.clientSecret = this.clientSecret;
      // console.log('cle', this.clientSecret);

      this.elements = this.stripe!.elements({
        clientSecret: this.clientSecret,
      });

      // Create and mount the payment element
      const options = { layout: 'tabs' /* options */ };
      const paymentElement = this.elements.create('payment', {
        paymentMethodOrder: ['card'],
        fields: { billingDetails: { address: { country: 'never' } } },
      });

      paymentElement.mount('#payment-element');
    }
  }

  async checkout() {
    this.loading = true;
    this.error = '';
    try {
      const stripe = await loadStripe(this.stripePublishableKey);
      // console.log('stripe is', stripe);

      if (!stripe) {
        // console.log('====================================');

        throw new Error('Stripe failed to load');
      }
      const { error } = await this.stripe!.confirmCardPayment(
        this.clientSecret,
        {
          payment_method: {
            card: this.card,
            billing_details: {
              email: this.email,
            },
          },
        }
      );
      if (error) {
        throw error;
      }
    } catch (error) {
      console.log('this step logged');
      console.log('Error:', error);
      this.error = 'An error occurred. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.location.back();
  }

  async handlePayment(event: Event) {
    event.preventDefault();
    if (!this.stripe || !this.card) return;

    const { error } = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {
          email: this.email,
        },
      },
    });

    if (error) {
      console.log('Payment error:', error);
      const cardErrorElement = document.getElementById('card-error') as any;
      if (cardErrorElement) {
        cardErrorElement.textContent = error.message;
      }
    } else {
      const resultMessageElement = document.querySelector('.result-message');
      if (resultMessageElement) {
        resultMessageElement.classList.remove('hidden');
      }
    }
  }

  // ------------------------------------promo code and calculate total and subtotal-----------------------
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
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error.errors[0].message;
          this.successMessage = '';
        },
      });
  }

  // ------------------------------------create payment intent----------------------------------------------
  paymentIntentId: string = '';
  errorPayment: string = '';
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
        },
        complete: () => {
          this.initializeStripe();
          this.checkout();
        },
        error: (err: HttpErrorResponse) => {
          this.errorPayment = err.error.message;
        },
      });
  }

  ngOnDestroy() {
    this.card?.destroy();
  }

  //   this.verifyPayment();
  // verifyPayment() {
  //   this.paymentService.verifyPayment(this.paymentIntentId).subscribe({
  //     next: (res: any) => {
  //       console.log(res);
  //     },
  //   });
  // }
}
