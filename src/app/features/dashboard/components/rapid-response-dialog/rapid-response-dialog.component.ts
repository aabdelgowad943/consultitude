import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

interface ResponseFeature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-rapid-response-dialog',
  imports: [CommonModule],
  templateUrl: './rapid-response-dialog.component.html',
  styleUrl: './rapid-response-dialog.component.scss',
})
export class RapidResponseDialogComponent {
  features: ResponseFeature[] = [
    {
      icon: 'images/Frame.svg',
      title: 'Instant AI Consultant Deployment',
      description:
        'AI consultants are instantly invited to analyze submitted documents and provide tailored, context-aware answers.',
    },
    {
      icon: 'images/Frame-1.svg',
      title: 'Document-Based Intelligence',
      description:
        'EVO Consultative AI, extracts key insights, identifies gaps, and delivers precise recommendations grounded in the submitted content.',
    },
    {
      icon: 'images/Frame-2.svg',
      title: 'Actionable Recommendations, Fast',
      description:
        'Get clear, actionable responses within minutes summarizing all AI consultants conversations.',
    },
  ];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  close() {
    this.ref.close();
  }

  next() {
    this.ref.close({ showStepper: true });
  }
}
