export interface CalculateAmount {
  orderDetails: OrderDetail[];
  voucherCode?: string;
  taxPercentage?: number;
}

export interface OrderDetail {
  productId: string;
  quantity: number;
}
