// Enums for known string literals
export enum ProductStatus {
  ARCHIVED = 'ARCHIVED',
  ACTIVE = 'ACTIVE',
}

export enum DocumentFormat {
  PDF = 'PDF',
  // Add other formats as needed
}

export enum LanguageCode {
  EN = 'EN',
  // Add other languages as needed
}

// Interface for Image object
export interface Image {
  url: string;
  name: string;
  description: string;
}

// Interface for Feature object
export interface Feature {
  name: string;
  description: string;
}

// Interface for Domain object
export interface Domain {
  name: string;
}

// Interface for AreaOfFocus object
export interface AreaOfFocus {
  name: string;
}

// Interface for Document object
export interface Document {
  documentFormat: DocumentFormat | string;
  size: number;
  sampleUrl: string;
  thumbnailUrl: string;
  url: string;
  language: LanguageCode | string;
}

// Main Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  status: ProductStatus;
  featured: boolean;
  downloads: number;
  images: Image[];
  features: Feature[];
  domains: Domain[];
  areaOfFocus: AreaOfFocus[];
  documents: Document[];
}

// Meta data interface
export interface Meta {
  requestId: string;
  timestamp: string;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

// Main response interface
export interface ApiResponse {
  success: boolean;
  message: string;
  data: Product[];
  meta: Meta;
}
