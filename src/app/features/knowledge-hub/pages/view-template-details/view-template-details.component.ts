import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { HttpClient } from '@angular/common/http';
import { ProductServiceService } from '../../services/product-service.service';
import { GlobalStateService } from '../../../../../shared/services/global-state.service';

@Component({
  selector: 'app-view-template-details',
  templateUrl: './view-template-details.component.html',
  styleUrl: './view-template-details.component.scss',
  imports: [CommonModule, RouterModule, CarouselModule],
})
export class ViewTemplateDetailsComponent {
  template: any;

  // create array if images
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
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
    'https://picsum.photos/200/300',
  ];

  defaultImageUrl = 'https://via.placeholder.com/300x150.png?text=No+Image';

  relatedArticles: {
    id: string;
    title: string;
    description: string;
    image: string;
    price: number;
    downloads: number;
  }[] = [];

  logoUrl = '/images/Logo.svg';
  backButtonText = 'Back to Knowledge Lounge';
  overviewTitle = 'Document Overview';
  overviewText = `The Business Strategy Template includes a fully structured storyline complete with ready-to-use slides, as well as frameworks, tools, tutorials, real-life examples, and best practices to help you:`;

  // Style Configurations
  // indicatorStyle = {
  //   width: '10px',
  //   height: '10px',
  //   borderRadius: '50%',
  // };
  // indicatorStyleClass = 'hover:bg-[#a24af5] cursor-pointer';

  // Component Configuration
  responsiveOptions: any[] = [
    { breakpoint: '1400px', numVisible: 5, numScroll: 5 },
    { breakpoint: '1199px', numVisible: 5, numScroll: 5 },
    { breakpoint: '767px', numVisible: 2, numScroll: 2 },
    { breakpoint: '575px', numVisible: 2, numScroll: 2 },
  ];

  details = [{ label: '', property: '' }];

  tags: any = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private router: Router, // Add Router
    private globalStateService: GlobalStateService
  ) {
    const templateId = this.route.snapshot.paramMap.get('id');
    if (templateId) {
      this.fetchTemplateById(templateId);
      // console.log('template id', templateId);
      this.getSimilarProducts(templateId);
    }
  }

  private fetchTemplateById(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
        // console.log('res is', response.data);

        this.template = this.mapApiResponseToTemplate(response.data);
        this.initializeTemplateData();
      },
      error: (err) => console.error('Error fetching template:', err),
    });
  }

  private mapApiResponseToTemplate(apiData: any): any {
    return {
      images: apiData.images.map((img: any) => img.url || this.defaultImageUrl),

      id: apiData.id,
      name: apiData.translations[0]?.name || 'No name',
      description: apiData.translations[0]?.description || 'No description',
      price: apiData.price,
      downloads: apiData.downloads,
      // images: apiData.images.map((img: any) => img.url),
      features: apiData.features.map(
        (feature: any) =>
          feature.translations[0]?.name || 'No feature description'
      ),
      domains: apiData.domains.map(
        (domain: any) => domain.domain.translations[0]?.name || 'Unknown domain'
      ),
      areaOfFocus: apiData.areaOfFocus.map(
        (focus: any) =>
          focus.AreaOfFocus.translations[0]?.name || 'Unknown focus area'
      ),
      documents: apiData.documents.map((doc: any) => ({
        format: doc.documentFormat.name,
        language: doc.language,
        size: doc.size,
        url: doc.url,
      })),
    };
  }

  private initializeTemplateData() {
    this.details = [
      { label: 'Format', property: 'documents.0.format' },
      { label: 'Language', property: 'documents.0.language' },
      { label: 'File Size', property: 'documents.0.size' },
      { label: 'Pages', property: 'document.0.pages' },
    ];
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

  // Update the download function
  downloadTemplate(documentUrl?: string) {
    const url = documentUrl || this.template.documents[0]?.url;
    if (url) {
      window.open(url, '_blank');
    }
  }

  getNestedProperty(obj: any, path: string) {
    // Convert array indexes to dot notation
    const parsedPath = path.replace(/\[(\d+)\]/g, '.$1');
    return parsedPath.split('.').reduce((o, p) => o && o[p], obj);
  }

  get buttons() {
    return [
      {
        label: `Buy Now $${this.template?.price}`,
        classes:
          'bg-[#7F56D9] hover:bg-[#a24af5] w-[172.5px] md:w-[220px] text-[#FFFFFF] py-3 px-[18px] rounded-md',
        action: () => this.handlePurchase(),
      },
      {
        label: 'Download Sample',
        classes:
          'bg-white border text-[#344054] w-[172.5px] md:w-[220px] text-[16px] leading-[24px] py-3 px-[18px] rounded-md',
        action: () =>
          this.downloadTemplate(this.template?.documents[0]?.sampleUrl),
      },
    ];
  }

  // private handlePurchase() {
  //   const userId = localStorage.getItem('userId');
  //   if (this.template?.id && userId) {
  //     this.router.navigate(['/knowledge/checkout', this.template.id]);
  //   } else {
  //     alert('you should login first');
  //     this.router.navigate(['/auth/login']);
  //   }
  // }

  private handlePurchase() {
    const userId = localStorage.getItem('userId');
    if (this.template?.id && userId) {
      // User is logged in: proceed to checkout
      this.router.navigate(['/knowledge/checkout', this.template.id]);
    } else {
      // No user: store pending purchase and navigate to login
      this.globalStateService.setPendingPurchase(this.template?.id);
      alert('You should login first');
      this.router.navigate(['/auth/login']);
    }
  }

  getSimilarProducts(id: string) {
    this.productService.getSimilarProductByProdId(id).subscribe({
      next: (response: any) => {
        console.log('response', response);

        // this.relatedArticles = response.data.map((item: any) => ({
        //   id: item.id,
        //   title: item.translations[0].name,
        //   description: item.translations[0].description,
        //   image: item.images[0].url,
        //   price: item.price,
        //   downloads: item.downloads,
        // }));
      },
    });
  }

  indicatorStyle = {
    // 'background-color': 'black',
    width: '10px',
    height: '10px',
    'border-radius': '50%',
    // opacity: '0.7',
  };

  // Optional: If you want to add a custom CSS class
  indicatorStyleClass = 'custom-indicator';
}
