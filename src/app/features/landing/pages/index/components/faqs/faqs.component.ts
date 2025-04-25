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
      question: 'What does “Talk to an AI Consultant” mean?',
      answer: `This feature allows you to interact with specialized AI agents pre-trained on different consulting logic, frameworks, and domains. Use it to get feedback, brainstorm, or refine your work—instantly.
`,
    },
    {
      question:
        'How does Consultitude ensure the quality of AI-generated content?',
      answer: `We use pretrained models specifically fine-tuned on consulting deliverables and frameworks, ensuring outputs are structured, relevant, and aligned with industry standards.
`,
    },
    {
      question: 'Can I upload confidential materials?',
      answer: `
Yes. We take data security seriously. All uploaded documents are encrypted, and access is restricted to your user session.
      `,
    },
    {
      question: 'Do I need to install anything to use Consultitude?',
      answer: `No installation is required. Consultitude is entirely cloud-based and accessible through your browser on desktop, tablet, or mobile.`,
    },
    {
      question: 'What formats are supported when uploading deliverables?',
      answer: `You can upload PowerPoint decks, PDFs, Word docs, and other common formats. The AI parses the content to offer insights, summaries, or structure new outputs from it.`,
    },
    {
      question: 'Can I export the generated content to my existing tools?',
      answer: `Yes. Presentations, insights, and templates created on Consultitude can be downloaded or exported to formats compatible with PowerPoint, Google Slides, and PDF.`,
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
