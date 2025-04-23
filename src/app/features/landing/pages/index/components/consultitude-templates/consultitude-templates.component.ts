import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-consultitude-templates',
  imports: [CommonModule, RouterModule],
  templateUrl: './consultitude-templates.component.html',
  styleUrl: './consultitude-templates.component.scss',
})
export class ConsultitudeTemplatesComponent {
  cards = [
    {
      id: 1,
      title: 'Consulting Companies',
      description:
        'Accelerate delivery, scale expertise, and boost team performance with AI-powered consulting workflows',
      backgroundImage: '/images/new/Group 12.svg',
      href: '/',
      width: '340',
      height: '210',
      class:
        'absolute w-[297px] md:w-[340px] md:h-52 md:-bottom-4 -bottom-20 -right-20 md:-right-10',
    },
    {
      id: 2,
      title: 'Management Consultant',
      description:
        'Accelerate your workflow, build smarter decks, and deliver your best presentations with powerful AI support.',
      backgroundImage: '/images/new/Group 12-1.svg',
      href: '/',
      width: '250',
      class:
        'absolute w-[297px] md:w-[330px] h-[131px] md:h-52 md:-bottom-4 -bottom-0 -right-10 md:-right-10',
    },
    {
      id: 3,
      title: 'Clients Seeking Consulting',
      description:
        'Upload consulting deliverables for deep analysis. Chat with pretrained AI consultants to get new perspectives. Or create your own structured presentations.',
      backgroundImage: '/images/new/Group 13.svg',
      href: '/',
      width: '220',
      class:
        'absolute md:w-[330px] w-[297px] h-[131px] md:h-52 md:-bottom-4 -bottom-0 -right-[80px] md:right-0 md:-right-20',
    },
  ];
}
