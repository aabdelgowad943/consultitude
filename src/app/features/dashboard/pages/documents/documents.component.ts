import { Component, OnInit } from '@angular/core';
import { DocumentsService } from '../../services/documents.service';
import { DocumentsResponse, Order } from '../../models/documents';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-documents',
  imports: [CommonModule, PaginatorModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
})
export class DocumentsComponent implements OnInit {
  images = [
    '/images/Pic1.svg',
    '/images/Pic2.svg',
    '/images/Pic3.svg',
    '/images/Pic4.svg',
  ];

  selectedImage: string = ''; // Variable to hold the selected image

  language: string = 'EN';
  documents: any[] = [];
  userId: string = '95b3acc4-e1f9-4f77-bfb8-cdb04e159f60';

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 6;

  first: number = 0; // Index of the first record
  rows: number = 6; // Number of rows per page
  totalRecords: number = 120; // Total number of records (update as needed)

  constructor(
    private documentService: DocumentsService,
    private router: Router
  ) {
    this.selectedImage = this.getRandomImage();
  }

  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
  }
  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService
      .getAllDocumentsByUserId(
        this.userId,
        this.currentPage,
        this.pageSize,
        this.language
      )
      .subscribe({
        next: (res: any) => {
          // Flatten the nested data structure
          this.documents = res.data.map((order: any) => {
            const orderDetail = order.orderDetails[0]; // first order detail
            const document = orderDetail.documents[0]; // first document
            return {
              id: order.id,
              orderCode: order.code,
              orderDate: order.createdAt,
              totalAmount: order.totalAmount,
              price: orderDetail.price,
              productName: orderDetail.name,
              url: document.url,
              documentFormat: document.documentFormat,
              language: document.language,
            };
          });
        },
        error: (err) => console.error('Error fetching documents:', err),
      });
  }

  nextPage() {
    this.currentPage++;
    this.loadDocuments();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadDocuments();
    }
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    // event.page is zero-based, so add 1 if you need a 1-indexed page number
    this.currentPage = event.page + 1;

    // Fetch new products based on the current page and rows per page
    this.loadDocuments();
  }

  viewTemplateDetails() {
    this.router.navigate([
      '/knowledge/view-template-details',
      // this.template.id,
    ]);
  }
}
