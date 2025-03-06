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
        'Save time & effort developing proposals & devliverables to your clients ',
      backgroundImage: '/images/card4icon.svg',
      href: '/',
      width: '340',
      height: '210',
      class:
        'absolute w-[297px] md:w-[340px] md:h-52 md:-bottom-4 -bottom-0 right-0 md:-right-0',
    },
    {
      id: 2,
      title: 'Management Consultant',
      description:
        'Boost your productivity & leverage top consulting companies approach & methodologies to win clients! ',
      backgroundImage: '/images/card2-icon.svg',
      href: '/',
      width: '250',
      class:
        'absolute w-[297px] md:w-[330px] h-[131px] md:h-52 md:-bottom-4 -bottom-0 right-0 md:-right-0',
    },
    {
      id: 3,
      title: 'Clients Seeking Consulting',
      description:
        'Relay less on consulting companies in each and every step you want & save your money!',
      backgroundImage: '/images/card3icon.svg',
      href: '/',
      width: '220',
      class:
        'absolute md:w-[330px] w-[297px] h-[131px] md:h-52 md:-bottom-4 -bottom-0 -right-[40px] md:right-0 md:-right-0',
    },
  ];
}
