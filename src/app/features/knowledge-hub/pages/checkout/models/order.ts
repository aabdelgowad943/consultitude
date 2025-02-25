export interface OrderDetail {
  productId: string;
  quantity: number;
}

export interface CalculateTotalAmountDto {
  orderDetails: OrderDetail[];
  voucherCode?: string;
  taxPercentage?: number;
}

export interface OrderRequest {
  currency: string;
  calculateTotalAmountDto: CalculateTotalAmountDto;
}

export interface OrderDetails {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrder {
  userId: string;
  paymentIntentId: string;
  orderDetails: OrderDetails[];
}
