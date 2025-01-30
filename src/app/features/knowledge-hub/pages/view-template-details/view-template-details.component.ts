import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-template-details',
  templateUrl: './view-template-details.component.html',
  styleUrl: './view-template-details.component.scss',
  imports: [CommonModule, RouterModule, CarouselModule],
})
export class ViewTemplateDetailsComponent {
  template: any;
  logoUrl = '/images/Logo.svg';
  backButtonText = 'Back to Knowledge Lounge';
  overviewTitle = 'Document Overview';
  overviewText = `The Business Strategy Template includes a fully structured storyline complete with ready-to-use slides, as well as frameworks, tools, tutorials, real-life examples, and best practices to help you:`;

  // Style Configurations
  indicatorStyle = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  };
  indicatorStyleClass = 'hover:bg-[#a24af5] cursor-pointer';

  // Component Configuration
  responsiveOptions: any[] = [
    { breakpoint: '1400px', numVisible: 5, numScroll: 5 },
    { breakpoint: '1199px', numVisible: 5, numScroll: 5 },
    { breakpoint: '767px', numVisible: 2, numScroll: 2 },
    { breakpoint: '575px', numVisible: 2, numScroll: 2 },
  ];

  // Content Data
  features = [
    '200 PowerPoint slides',
    'Proven frameworks from ex-McKinsey/BCC consultants',
    'End-to-end strategy presentation templates',
    'Best practice library of slides',
    'Pick-and-choose modular system',
    'Fully editable and customizable',
  ];

  buttons = [
    {
      label: 'Buy Now $129',
      classes:
        'bg-[#9241DC] hover:bg-[#a24af5] w-full md:w-[220px] justify-center px-2 text-center text-white py-3 rounded-lg font-semibold transition-all flex items-center gap-2',
    },
    {
      label: 'Download Sample',
      classes:
        'bg-white border text-black w-full md:w-[220px] justify-center py-3 px-2 text-center rounded-lg font-semibold transition-all  flex items-center gap-2',
    },
  ];

  details = [
    { label: 'Format', property: 'format' },
    { label: 'Use Case', property: 'documentType' },
    { label: 'Document Focus', property: 'downloads' },
    { label: 'Pages', property: 'downloads' },
  ];

  tags = [
    {
      title: 'Related Domains',
      tags: ['Strategy', 'Delivery', 'Digital'],
    },
    {
      title: 'Relevant Locations',
      tags: ['KSA', 'GCC'],
    },
    {
      title: 'Area of focus',
      tags: ['Cultural Transformation', 'GCC'],
    },
    {
      title: 'Document Tags',
      tags: [
        'Clean',
        'Creative',
        'Pitchdeck',
        'Company',
        'Modern',
        'Portfolio',
        'Agency',
        'Startup',
        'Infographic',
        'Business',
        'Corporate',
        'Professional',
        'Proposal',
        'Teamwork',
        'Office',
      ],
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.template = navigation?.extras.state?.['template'];
    if (!this.template) {
      const templateId = this.route.snapshot.paramMap.get('id');
      this.fetchTemplateById(templateId);
    } else {
      this.initializeTemplateImages();
    }
  }

  private fetchTemplateById(id: string | null) {
    console.log('Fetching template by ID:', id);
    this.http.get('/data/product.json').subscribe((data: any) => {
      const products = data.products[0].items;
      this.template = products.find((item: any) => item.id === id);
      this.initializeTemplateImages();
    });
  }

  private initializeTemplateImages() {
    if (this.template) {
      this.template.images = [
        '/images/animation-card1.svg',
        '/images/animation-card2.svg',
        '/images/animation-card3.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
        '/images/animation-card4.svg',
      ];
    }
  }

  downloadTemplate() {
    console.log('Downloading template:', this.template.name);
  }

  relatedArticles = [
    {
      image:
        'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-1.png',
      title: 'Business Strategy ',
      description:
        'How we built our first office space for optimal collaboration',
      readTime: '2 minutes',
      views: '1.5k',
      tags: ['Office', 'Culture', 'Design'],
      link: '#',
    },
    {
      image:
        'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-2.png',
      title: 'Enterprise design ',
      description: 'Best practices for enterprise UX design systems',
      readTime: '12 minutes',
      views: '2.1k',
      tags: ['Design', 'Enterprise'],
      link: '#',
    },
    {
      image:
        'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-3.png',
      title: 'Google partnership',
      description: 'Announcing our strategic partnership with Google Cloud',
      readTime: '8 minutes',
      views: '890',
      tags: ['Partnership', 'Cloud'],
      link: '#',
    },
    {
      image:
        'https://flowbite.s3.amazonaws.com/blocks/marketing-ui/article/blog-4.png',
      title: 'React project',
      description: 'Lessons learned from our first large React project',
      readTime: '4 minutes',
      views: '2.8k',
      tags: ['React', 'Development'],
      link: '#',
    },
  ];
}
