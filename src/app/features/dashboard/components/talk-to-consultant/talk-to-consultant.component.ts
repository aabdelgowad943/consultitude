import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

interface ConsultantFeature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-talk-to-consultant',
  imports: [CommonModule],
  templateUrl: './talk-to-consultant.component.html',
  styleUrl: './talk-to-consultant.component.scss',
})
export class TalkToConsultantComponent implements OnInit {
  features: ConsultantFeature[] = [
    {
      icon: 'images/new/persona-icon.svg',
      title: 'Persona-Based Expertise',
      description:
        'Choose from specialized consultants—Marketing, Policy, Cultural Transformation, and many others— to get insights & recommendations.',
    },
    {
      icon: 'images/new/star-icon.svg',
      title: 'Tailored Recommendations',
      description:
        'Your AI consultant learns from your inputs to offer precise guidance and next steps for projects, proposals, or organizational challenges.',
    },
    {
      icon: 'images/new/share-icon.svg',
      title: 'Seamless Collaboration',
      description:
        'Chat in real-time, ask follow-up questions, and share findings with your team to keep everyone on the same page.',
    },
  ];

  data: any;
  serviceId: string = '';
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit(): void {
    this.data = this.config.data;
    this.serviceId = this.data.serviceId;
    console.log('service id================', this.serviceId);
    localStorage.setItem('serviceId', this.serviceId);
  }

  close() {
    this.ref.close();
  }

  next() {
    this.ref.close({ showStepper: true });
  }
}
