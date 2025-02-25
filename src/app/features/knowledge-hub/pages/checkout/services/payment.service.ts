import { Injectable } from '@angular/core';
import { ApiService } from '../../../../../../shared/services/api.service';
import { Voucher } from '../models/voucher';
import { Observable } from 'rxjs';
import { CalculateAmount } from '../models/calculate-amount';
import { CreateOrder, OrderRequest } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private apiService: ApiService) {}

  applyVoucher(voucher: Voucher): Observable<Voucher> {
    return this.apiService.post('/vouchers/verify', voucher);
  }

  calculateTotalAmount(
    calculateTotalAmount: CalculateAmount
  ): Observable<CalculateAmount> {
    return this.apiService.post(
      '/orders/calculate-total-amount',
      calculateTotalAmount
    );
  }

  createPaymentIntent(order: OrderRequest): Observable<OrderRequest> {
    return this.apiService.post('/orders/create-payment-intent', order);
  }

  verifyPayment(paymentIntentId: string): Observable<any> {
    return this.apiService.post('/orders/verify-payment', paymentIntentId);
  }

  createOrder(createOrder: CreateOrder): Observable<CreateOrder> {
    return this.apiService.post<CreateOrder>('/orders', createOrder);
  }
}
