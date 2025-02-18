import {
  Component,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { AuthService } from '../../../../../auth/services/auth.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PaymentComponent implements AfterViewInit, OnChanges {
  @Input() productPrice: number = 0;
  email: string = '';
  emailExists: boolean = false;
  showError: boolean = false;
  promoCode: string = '';
  subtotal: number = 0;
  discount: number = 0;
  total: number = 0;
  dummyEmails: string[] = ['islam@mail.com', 'ahmed@mail.com'];
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: any;
  clientSecret: string = '';
  stripePublishableKey: string = 'pk_test_G5bt1644CG8jzK2PPr9mHQYj00hm5lHkLu';

  constructor(private location: Location, private authService: AuthService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productPrice']) {
      this.subtotal = this.productPrice;
      this.total = this.subtotal - this.discount;
    }
  }

  async ngAfterViewInit() {
    if (this.emailExists) {
      await this.initializeStripe();
    }
  }

  ngOnDestroy() {
    this.card?.destroy();
  }

  async initializeStripe() {
    this.stripe = await loadStripe(
      'pk_test_G5bt1644CG8jzK2PPr9mHQYj00hm5lHkLu'
    );
    if (this.stripe) {
      this.clientSecret =
        'pi_3Qr55UBA1qtFyZ9r09RHAMJC_secret_12s4dXtWfg0cODXZCEt3WLj6U';
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

  async handlePayment(event: Event) {
    event.preventDefault();
    if (!this.stripe || !this.card) return;

    const { error } = await this.stripe.confirmCardPayment(
      'pi_3MtwBwLkdIwHu7ix28a3tqPa_secret_YrKJUKribcBjcG8HVhfZluoGH',
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
      console.error('Payment error:', error);
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
  amount: number = 10.0;
  description: string = 'Custom payment';
  loading = false;
  error = '';

  isValidAmount(): boolean {
    return this.amount >= 0.5 && this.amount <= 999999.99;
  }

  async checkout() {
    if (!this.isValidAmount()) {
      this.error = 'Please enter a valid amount between $0.50 and $999,999.99';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const stripe = await loadStripe(this.stripePublishableKey);

      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { error } = await this.stripe!.confirmCardPayment(
        this.stripePublishableKey,
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
      console.error('Error:', error);
      this.error = 'An error occurred. Please try again.';
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.location.back();
  }

  checkEmail() {
    this.emailExists = this.dummyEmails.includes(this.email);
    this.showError = !this.emailExists;
    if (this.emailExists) {
      setTimeout(() => this.initializeStripe(), 100);
    }
  }

  editEmail() {
    this.emailExists = false;
    this.showError = false;
  }

  applyPromoCode() {
    if (this.promoCode === 'ahmed10') {
      this.discount = this.subtotal * 0.1;
    } else {
      this.discount = 0;
    }
    this.total = this.subtotal - this.discount;
  }
}
