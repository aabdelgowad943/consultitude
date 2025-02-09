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

  constructor(private location: Location) {}

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
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
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
