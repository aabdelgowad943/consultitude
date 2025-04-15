export interface ApiResponseMeta {
  requestId: string;
  timestamp: string;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}
