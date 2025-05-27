import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface CarouselImage {
  id: number;
  src: string;
  alt: string;
  title?: string;
}

@Component({
  selector: 'app-carousel-about-us',
  imports: [CommonModule],
  templateUrl: './carousel-about-us.component.html',
  styleUrl: './carousel-about-us.component.scss',
})
export class CarouselAboutUsComponent {
  images: CarouselImage[] = [
    {
      id: 1,
      src: 'images/Container-2.png',
      alt: 'Vision 2030',
      title: 'Vision 2030',
    },
    {
      id: 2,
      src: 'images/animation-card2.svg',
      alt: 'Generative AI slide',
      title: 'Generative AI',
    },
    {
      id: 3,
      src: 'images/animation-card3.svg',
      alt: 'Top Consulting Templates',
      title: 'Top Consulting Templates',
    },
    {
      id: 4,
      src: 'images/animation-card4.svg',
      alt: 'Consultitude Resources',
      title: 'Consultitude Resources',
    },
  ];

  activeIndex = 0;
  private intervalId: any;

  ngOnInit(): void {
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  startAutoScroll(): void {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoScroll(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.activeIndex =
      (this.activeIndex - 1 + this.images.length) % this.images.length;
  }

  goToSlide(index: number): void {
    this.activeIndex = index;
    this.stopAutoScroll();
    this.startAutoScroll();
  }
}
