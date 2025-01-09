import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-consultitude-templates',
  imports: [CommonModule],
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
      backgroundImage: '/images/Footer Icons.svg',
      href: '/',
    },
    {
      id: 2,
      title: 'Management Consultant',
      description:
        'Boost your productivity & leverage top consulting companies approach & methodologies to win clients! ',
      backgroundImage: '/images/Footer Icons.svg',
      href: '/',
    },
    {
      id: 3,
      title: 'Clients Seeking Consulting',
      description:
        'Relay less on consulting companies in each and every step you want & save your money!',
      backgroundImage: '/images/Footer Icons.svg',
      href: '/',
    },
  ];
}
