import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-consulting-needs',
  imports: [CommonModule],
  templateUrl: './consulting-needs.component.html',
  styleUrl: './consulting-needs.component.scss',
})
export class ConsultingNeedsComponent {
  cards = [
    {
      id: 1,
      title: 'Consulting Toolkit',
      description:
        'A comprehensive library of slide layouts, templates, and typical consulting tools and frameworks. ',
      backgroundImage: '/images/Footer Icons.svg',
      href: '/',
    },
    {
      id: 2,
      title: 'Business Strategy',
      description:
        'Easily create personalized reports. Customize metrics and visuals to meet your business needs and impress stakeholders.',
      backgroundImage: '/images/Footer Icons.svg',
      href: '/',
    },
    {
      id: 3,
      title: 'Business Case',
      description:
        'Easily create personalized reports. Customize metrics and visuals to meet your business needs and impress stakeholders.',
      backgroundImage: '/images/Footer Icons.svg',
      href: '/',
    },
    {
      id: 4,
      title: 'Consulting Proposal',
      description:
        'A comprehensive library of slide layouts, templates, and typical consulting tools and frameworks..',
      backgroundImage: '/images/Footer Icons.svg',
      href: '/',
    },
    {
      id: 5,
      title: 'Marketing Analysis',
      description:
        'Easily create personalized reports. Customize metrics and visuals to meet your business needs and impress stakeholders.',
      backgroundImage: '/images/Footer Icons.svg',
      href: '/',
    },
    {
      id: 6,
      title: 'Market Entry Analysis',
      description:
        'Easily create personalized reports. Customize metrics and visuals to meet your business needs and impress stakeholders.',
      backgroundImage: '/images/Footer Icons.svg',
      href: '/',
    },
  ];
}
