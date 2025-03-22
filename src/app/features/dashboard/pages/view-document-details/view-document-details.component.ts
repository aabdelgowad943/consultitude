import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { DocumentsService } from '../../services/documents.service';
import { ViewDocLoaderComponent } from '../../../../shared/loaders/view-doc-loader/view-doc-loader.component';

interface Document {
  id: string;
  url: string;
  sampleUrl: string;
  thumbnailUrl: string;
  size: number;
  numberOfPages: number | null;
  language: string;
  documentFormatId: string;
  documentFormat: {
    id: string;
    name: string;
  };
}

interface OrderDetail {
  price: number;
  product: {
    translations: { name: string }[];
    documents: Document[];
    domains: { domain: { translations: { name: string }[] } }[];
    areaOfFocus: { AreaOfFocus: { translations: { name: string }[] } }[];
    regions: any[];
    tags: any[];
    images: { id: string; url: string }[];
  };
}

interface DocumentResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    code: string;
    totalAmount: number;
    createdAt: string;
    orderDetails: OrderDetail[];
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

interface MappedDocument {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  features: string[];
  domains: string[];
  areaOfFocus: string[];
  documents: {
    format: string;
    language: string;
    size: number;
    url: string;
    sampleUrl: string;
    numberOfPages: number | null;
  }[];
}

@Component({
  selector: 'app-view-document-details',
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    NavbarComponent,
    ViewDocLoaderComponent,
  ],
  templateUrl: './view-document-details.component.html',
  styleUrl: './view-document-details.component.scss',
})
export class ViewDocumentDetailsComponent implements OnInit {
  template: MappedDocument | null = null;
  isLoading = false;
  error: string | null = null;

  // Placeholder images until real images are loaded
  images: any = [
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
  ];
  defaultImageUrl = 'https://picsum.photos/200/300';

  logoUrl = '/images/Logo.svg';
  backButtonText = 'Back to document Lounge';
  overviewTitle = 'Document Overview';
  overviewText = `The Business Strategy Template includes a fully structured storyline complete with ready-to-use slides, as well as frameworks, tools, tutorials, real-life examples, and best practices to help you:`;

  indicatorStyle = {
    width: '10px',
    height: '10px',
    'border-radius': '50%',
  };

  indicatorStyleClass = 'custom-indicator';

  responsiveOptions: any[] = [
    { breakpoint: '1400px', numVisible: 5, numScroll: 5 },
    { breakpoint: '1199px', numVisible: 5, numScroll: 5 },
    { breakpoint: '767px', numVisible: 2, numScroll: 2 },
    { breakpoint: '575px', numVisible: 2, numScroll: 2 },
  ];

  details = [
    { label: 'Format', property: 'documents.0.format' },
    { label: 'Language', property: 'documents.0.language' },
    { label: 'File Size', property: 'documents.0.size' },
    { label: 'Pages', property: 'documents.0.numberOfPages' },
  ];

  tags: any = [];

  constructor(
    private route: ActivatedRoute,
    private documentsService: DocumentsService
  ) {}

  ngOnInit(): void {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (documentId) {
      this.fetchDocumentDetails(documentId);
    } else {
      this.error = 'No document ID provided';
      this.isLoading = false;
    }
  }

  private fetchDocumentDetails(documentId: string): void {
    this.isLoading = true;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.error = 'User not authenticated';
      this.isLoading = false;
      return;
    }

    this.documentsService
      .viewDocumentByUserIdAndByOrderId(userId, documentId, 'EN')
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.success && response.data?.orderDetails?.length > 0) {
            this.template = this.mapResponseToTemplate(response.data);
            this.initializeTemplateData();
            // this.loadImages();
          } else {
            this.error = 'No document details found';
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.error('Error fetching document details:', err);
          this.error = 'Failed to load document details';
          this.isLoading = false;
        },
      });
  }

  private mapResponseToTemplate(data: any): MappedDocument {
    const orderDetail = data.orderDetails[0];
    const product = orderDetail.product;

    return {
      id: data.id,
      name: product.translations[0]?.name || 'Untitled Document',
      description:
        product.translations[0]?.description || 'No description available',
      price: data.totalAmount,
      images: product.images.map((img: any) => img.url || this.defaultImageUrl),
      features: [], // Add features if available in your data
      domains: product.domains.map(
        (domain: any) => domain.domain.translations[0]?.name || 'Unknown domain'
      ),
      areaOfFocus: product.areaOfFocus.map(
        (focus: any) =>
          focus.AreaOfFocus.translations[0]?.name || 'Unknown focus area'
      ),
      documents: product.documents.map((doc: any) => ({
        format: doc.documentFormat.name,
        language: doc.language,
        size: doc.size,
        url: doc.url,
        sampleUrl: doc.sampleUrl,
        numberOfPages: doc.numberOfPages,
      })),
    };
  }

  // private loadImages(): void {
  //   if (this.template?.images && this.template.images.length > 0) {
  //     // this.images = this.template.images;
  //     this.images = Array(5).fill(this.defaultImageUrl);
  //   } else {
  //     // Populate with placeholders if no images
  //     this.images = Array(5).fill(this.defaultImageUrl);
  //   }
  // }

  private initializeTemplateData(): void {
    if (!this.template) return;

    this.tags = [
      {
        title: 'Related Domains',
        tags: [...new Set(this.template.domains)],
      },
      {
        title: 'Area of Focus',
        tags: [...new Set(this.template.areaOfFocus)],
      },
      {
        title: 'Available Formats',
        tags: [...new Set(this.template.documents.map((d: any) => d.format))],
      },
      {
        title: 'Supported Languages',
        tags: [...new Set(this.template.documents.map((d: any) => d.language))],
      },
    ];
  }

  downloadTemplate(documentUrl?: string): void {
    const url = documentUrl || this.template?.documents[0]?.url;
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('No document URL available for download');
    }
  }

  getNestedProperty(obj: any, path: string): any {
    if (!obj) return null;
    const parsedPath = path.replace(/\[(\d+)\]/g, '.$1');
    return parsedPath
      .split('.')
      .reduce((o, p) => (o && o[p] !== undefined ? o[p] : null), obj);
  }

  get buttons(): { label: string; classes: string; action: () => void }[] {
    return [
      {
        label: 'Download Now',
        classes:
          'bg-[#7F56D9] hover:bg-[#a24af5] text-white xs:w-[90%] xss:w-full border w-full py-3 px-[18px] rounded-md',
        action: () => this.downloadTemplate(this.template?.documents[0]?.url),
      },
    ];
  }
}
