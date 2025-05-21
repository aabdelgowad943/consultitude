import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-faqs',
  imports: [
    CommonModule,
    FooterComponent,
    ContactusComponent,
    NavbarComponent,
    RouterModule,
  ],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss',
})
export class FaqsComponent {
  faqData = [
    {
      question: 'What is Consultitude?',
      answer: `Consultitude is an AI-powered platform built for the consulting world. It helps consultants, consulting firms, and clients create, validate, and enhance consulting-grade work — faster, more affordably, and with high-quality standards you can trust.
`,
    },
    {
      question:
        ' How is Consultitude different from ChatGPT or other AI tools?',
      answer: `Consultitude goes beyond general AI content creation. It delivers consulting-grade outputs through structured thinking, domain-specific expertise, and professional polish. Whether you re brainstorming strategies, validating reports, or building executive-ready deliverables, Consultitude is designed for depth, quality, and real-world consulting use cases — not just generic answers.`,
    },
    {
      question: 'Who can use Consultitude?',
      answer: `
    <ul class="list-disc pl-5 space-y-1">
    <li>Independent consultants aiming to deliver faster, higher-quality work.</li>
    <li>Consulting firms looking to scale their services while maintaining quality.</li>
    <li>Clients seeking faster access to consulting insights and validation at a reasonable cost.</li>
    <li>If you work in or with consulting, Consultitude is designed for you.</li>
</ul>

      `,
    },
    {
      question: 'Is the work really "consulting-grade"?',
      answer: `Yes. Consultitude combines domain-specific AI expertise, structured multi-perspective feedback, and quality moderation. Every output is designed to meet the high standards of professional consulting — clear logic, sharp thinking, and executive-level presentation.`,
    },
    {
      question: 'What kind of work can I create or improve with Consultitude?',
      answer: `
    <ul class="list-disc pl-5 space-y-1">
      <li>Validate reports, decks, and strategic documents</li>
      <li>Build structured slide presentations</li>
      <li>Brainstorm and refine strategies and business ideas</li>
      <li>Access consulting-grade templates and frameworks</li>
      <li>Get multi-perspective feedback on proposals, business cases, and more</li>
    </ul>
  `,
    },
    {
      question: 'Can I upload my own documents for support?',
      answer: `Absolutely. Consultitude lets you upload your documents to get tailored feedback, enhancements, and consulting-grade outputs.Whether you're validating an idea, building a deck, or preparing a report, your uploads are fully integrated into the experience.`,
    },
    {
      question: 'Is Consultitude a replacement for human consultants?',
      answer: `Consultitude is a powerful extension of your consulting capabilities — not a complete replacement.It accelerates validation, enhances deliverables, and expands access to expert thinking. For highly complex or sensitive projects, human consultants may still be involved, but even they can use Consultitude to deliver faster, better results.`,
    },
    {
      question: 'How much does Consultitude cost?',
      answer: `Flexible pricing options will be available at launch, tailored for individual consultants, firms, and organizations.Our goal is to make consulting-grade support accessible at a fraction of traditional consulting costs.`,
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
