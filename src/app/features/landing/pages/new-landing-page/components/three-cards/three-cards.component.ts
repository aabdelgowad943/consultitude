import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-three-cards',
  imports: [CommonModule, RouterModule],
  templateUrl: './three-cards.component.html',
  styleUrl: './three-cards.component.scss',
})
export class ThreeCardsComponent {
  cards = [
    {
      id: 1,
      title: 'Independent Consultants',
      description:
        'Accelerate your thinking, generate decks faster, and deliver your best work with AI-assisted tools.',
      backgroundImage: 'images/landing/Pattern 1.svg',
      href: '/',
      width: '340',
      height: '210',
      class:
        'absolute w-[297px] md:w-[340px] md:h-52 md:-bottom-0 -bottom-20 right-5',
    },
    {
      id: 2,
      title: 'Consulting Firms',
      description:
        'Boost delivery speed, build internal IP, and scale your consulting products with AI-powered workflows.',
      backgroundImage: 'images/landing/Pattern 2.svg',
      href: '/',
      width: '250',
      class:
        'absolute w-[297px] md:w-[330px] h-[131px] md:h-52 md:-bottom-4 -bottom-0 right-5',
    },
    {
      id: 3,
      title: 'Clients Seeking Consulting',
      description:
        'Upload deliverables for AI analysis, chat with pre-trained agents, or generate structured presentations instantly',
      backgroundImage: 'images/landing/Pattern 3.svg',
      href: '/',
      width: '220',
      class:
        'absolute md:w-[330px] w-[297px] h-[131px] md:h-52 md:-bottom-0 -bottom-0 right-5',
    },
  ];
}
