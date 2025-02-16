import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-animation-cards',
  templateUrl: './animation-cards.component.html',
  imports: [CommonModule],
  styleUrls: ['./animation-cards.component.scss'],
})
export class AnimationCardsComponent implements OnInit {
  ngOnInit(): void {
    const scrollers = document.querySelectorAll('.scroller');

    // If a user hasn't opted in for recuded motion, then we add the animation
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      addAnimation();
    }

    function addAnimation() {
      scrollers.forEach((scroller: any) => {
        // add data-animated="true" to every `.scroller` on the page
        scroller.setAttribute('data-animated', true);

        // Make an array from the elements within `.scroller-inner`
        const scrollerInner = scroller.querySelector('.scroller__inner');
        const scrollerContent = Array.from(scrollerInner.children);

        // For each item in the array, clone it
        // add aria-hidden to it
        // add it into the `.scroller-inner`
        scrollerContent.forEach((item: any) => {
          const duplicatedItem = item.cloneNode(true);
          duplicatedItem.setAttribute('aria-hidden', true);
          scrollerInner.appendChild(duplicatedItem);
        });
      });
    }
  }
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
