// documents.interface.ts
export interface Document {
  url: string;
  documentFormat: string;
  language: string;
}

export interface OrderDetail {
  price: number;
  name: string;
  documents: Document[];
}

export interface Order {
  id: string;
  code: string;
  totalAmount: number;
  createdAt: string;
  orderDetails: OrderDetail[];
}

export interface DocumentsResponse {
  id: string;
  url: string;
  documentFormat: string;
  language: string;
  price: number;
  productName: string;
  orderCode: string;
  orderDate: string;
}
