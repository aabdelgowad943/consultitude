import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ProductServiceService } from '../../services/product-service.service';
import { GlobalStateService } from '../../../../../shared/services/global-state.service';
import { Subscription } from 'rxjs';
import { ViewTemplateLoaderComponent } from '../../../../shared/loaders/view-template-loader/view-template-loader.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ShouldLoginFirstComponent } from '../../../../../shared/components/should-login-first/should-login-first.component';

@Component({
  selector: 'app-view-template-details',
  templateUrl: './view-template-details.component.html',
  styleUrl: './view-template-details.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    CarouselModule,
    ViewTemplateLoaderComponent,
  ],
  providers: [DialogService],
})
export class ViewTemplateDetailsComponent implements OnInit, OnDestroy {
  template: any;
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

  defaultImageUrl = 'https://via.placeholder.com/300x150.png?text=No+Image';

  relatedArticles: any[] = [];

  logoUrl = '/images/Logo.svg';
  backButtonText = 'Back to Knowledge Lounge';
  overviewTitle = 'Document Overview';
  overviewText = `The Business Strategy Template includes a fully structured storyline complete with ready-to-use slides, as well as frameworks, tools, tutorials, real-life examples, and best practices to help you:`;

  responsiveOptions: any[] = [
    { breakpoint: '1400px', numVisible: 5, numScroll: 5 },
    { breakpoint: '1199px', numVisible: 5, numScroll: 5 },
    { breakpoint: '767px', numVisible: 2, numScroll: 2 },
    { breakpoint: '575px', numVisible: 2, numScroll: 2 },
  ];

  details = [{ label: '', property: '' }];
  tags: any = [];
  private routeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private router: Router,
    private globalStateService: GlobalStateService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    // Subscribe to route parameter changes
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      const templateId = params.get('id');
      if (templateId) {
        this.fetchTemplateById(templateId);
        this.getSimilarProducts(templateId);
      }
    });
  }

  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private fetchTemplateById(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (response: any) => {
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

  downloadTemplate(documentUrl?: string) {
    const url = documentUrl || this.template.documents[0]?.url;
    if (url) {
      window.open(url, '_blank');
    }
  }

  getNestedProperty(obj: any, path: string) {
    const parsedPath = path.replace(/\[(\d+)\]/g, '.$1');
    return parsedPath.split('.').reduce((o, p) => o && o[p], obj);
  }

  get buttons() {
    return [
      {
        label: `Buy Now $${this.template?.price}`,
        classes:
          'bg-[#7F56D9] hover:bg-[#a24af5] xss:w-[172.5px] ipad:w-full  big:w-[220px] text-[#FFFFFF] py-3 px-[18px] rounded-md',
        action: () => this.handlePurchase(),
      },
      {
        label: 'Download Sample',
        classes:
          'bg-white border text-[#344054] xss:w-[172.5px] ipad:w-full  big:w-[220px] text-[16px] leading-[24px] py-3 px-[18px] rounded-md',
        action: () =>
          this.downloadTemplate(this.template?.documents[0]?.sampleUrl),
      },
    ];
  }

  private handlePurchase() {
    const userId = localStorage.getItem('userId');
    if (this.template?.id && userId) {
      this.router.navigate(['/knowledge/checkout', this.template.id]);
    } else {
      this.globalStateService.setPendingPurchase(this.template?.id);
      // alert('You should login first');
      this.dialogService.open(ShouldLoginFirstComponent, {
        width: '600px',
        height: 'auto',
        closeOnEscape: true,
      });
      // this.router.navigate(['/auth/login']);
    }
  }

  getSimilarProducts(id: string) {
    this.productService.getSimilarProductByProdId(id).subscribe({
      next: (response: any) => {
        // Map the API response to the expected format for display
        this.relatedArticles = response.data.map((product: any) => {
          return {
            id: product.id,
            name: product.name || product.translations?.[0]?.name || 'No name',
            description:
              product.description ||
              product.translations?.[0]?.description ||
              'No description',
            image: product.images?.[0]?.url || this.defaultImageUrl,
            price: product.price || 0,
            downloads: product.downloads || 0,
            featured: product.featured || false,
            // Include domains for tags if available
            domains:
              product.domains?.map(
                (domain: any) =>
                  domain.domain?.translations?.[0]?.name ||
                  domain.name ||
                  'Unknown domain'
              ) || [],
            areaOfFocus: product.areaOfFocus?.map(
              (areaOfFocus: any) =>
                areaOfFocus.areaOfFocus?.translations?.[0]?.name ||
                areaOfFocus.name
            ),
          };
        });
      },
      error: (err) => console.error('Error fetching similar products:', err),
    });
  }

  viewDetail(id: string) {
    this.router.navigate(['/knowledge/view-template-details', id]);
    window.scrollTo(0, 0);
  }

  indicatorStyle = {
    width: '10px',
    height: '10px',
    'border-radius': '50%',
  };

  indicatorStyleClass = 'custom-indicator';
}
