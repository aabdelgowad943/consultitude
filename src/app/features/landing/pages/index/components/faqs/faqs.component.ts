import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-faqs',
  imports: [CommonModule],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss',
})
export class FaqsComponent {
  faqData = [
    {
      question: 'Why should I use consultitude templates?',
      answer: `You can purchase them directly through our website on the Templates & Playbooks page.`,
    },
    {
      question: 'Where can I purchase consultitude templates and playbooks?',
      answer: `You can purchase them directly through our website on the Templates & Playbooks page.`,
    },
    {
      question: 'What updates are included with consultitude templates?',
      answer: `The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone components, whereas Tailwind UI offers sections of pages.`,
    },
    {
      question: 'How do I customize the templates for my brand?',
      answer: `The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone components, whereas Tailwind UI offers sections of pages.`,
    },
    {
      question: 'Can I use consultitude templates for commercial projects?',
      answer: `The main difference is that the core components from Flowbite are open source under the MIT license, whereas Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone components, whereas Tailwind UI offers sections of pages.`,
    },
    {
      question: 'How often are your templates updated?',
      answer: `Flowbite supports modern browsers including Chrome, Firefox, Safari, and Edge. For older versions of Internet Explorer, limited support may apply depending on the components used.`,
    },
  ];

  openIndex: number | null = null;

  toggleAccordion(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }

  isOpen(index: number): boolean {
    return this.openIndex === index;
  }
}
