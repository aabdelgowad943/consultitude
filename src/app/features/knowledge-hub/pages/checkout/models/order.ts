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
