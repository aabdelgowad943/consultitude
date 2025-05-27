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
      title: 'Consulting Firms',
      description:
        'Accelerate delivery, scale expertise, and boost team performance with AI-powered consulting workflows',
      backgroundImage: '/images/new/Consulting Firms.svg',
      href: '/',
      width: '340',
      height: '210',
      class:
        'absolute w-[297px] md:w-[340px] md:h-52 md:-bottom-0 -bottom-20 -right-10 md:-right-10',
    },
    {
      id: 2,
      title: 'Consulting Professionals',
      description:
        'Accelerate your workflow, build smarter decks, and deliver your best presentations with powerful AI support.',
      backgroundImage: '/images/new/Consulting Professionals (1).svg',
      href: '/',
      width: '250',
      class:
        'absolute w-[297px] md:w-[330px] h-[131px] md:h-52 md:-bottom-4 -bottom-0 -right-10 md:-right-10',
    },
    {
      id: 3,
      title: 'Consulting Clients',
      description:
        'Upload deliverables for AI analysis, chat with pre-trained agents, or generate structured presentations instantly',
      backgroundImage: '/images/new/Consulting Clients (1).svg',
      href: '/',
      width: '220',
      class:
        'absolute md:w-[330px] w-[297px] h-[131px] md:h-52 md:-bottom-0 -bottom-0 -right-[80px] md:-right-[70px]',
    },
  ];
}
