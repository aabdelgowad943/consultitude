import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';

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
        'bg-[#9241DC] hover:bg-[#a24af5] w-full md:w-[220px] justify-center px-2 text-center text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2',
    },
    {
      label: 'Download Sample',
      classes:
        'bg-white border text-black w-full md:w-[220px] justify-center py-3 px-2 text-center rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2',
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

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.template = navigation?.extras.state?.['template'];
    this.initializeTemplateImages();
  }

  private initializeTemplateImages() {
    this.template.images = [
      '/images/animation-card1.svg',
      '/images/animation-card2.svg',
      '/images/animation-card3.svg',
      '/images/animation-card4.svg',
      '/images/animation-card4.svg',
      '/images/animation-card4.svg',
    ];
  }

  downloadTemplate() {
    console.log('Downloading template:', this.template.name);
  }
}
