import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-animation-cards',
  templateUrl: './animation-cards.component.html',
  imports: [CommonModule],
  styleUrls: ['./animation-cards.component.scss'],
})
export class AnimationCardsComponent {
  toLeftCard = [
    { id: 1, image: '/images/animation-card1.svg' },
    { id: 2, image: '/images/animation-card2.svg' },
    { id: 3, image: '/images/animation-card3.svg' },
    { id: 4, image: '/images/animation-card4.svg' },
  ];
  toRightCard = [
    { id: 1, image: '/images/animation-card8.svg' },
    { id: 2, image: '/images/animation-card7.svg' },
    { id: 3, image: '/images/animation-card6.svg' },
    { id: 4, image: '/images/animation-card5.svg' },
  ];
}
