import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-values-grid-component',
  imports: [CommonModule],
  templateUrl: './values-grid-component.component.html',
  styleUrl: './values-grid-component.component.scss',
})
export class ValuesGridComponentComponent {
  values: ValueItem[] = [
    {
      icon: 'lightbulb',
      title: 'Innovation',
      description:
        'Constantly exploring new ideas and tools to improve the consulting process and drive progress.',
    },
    {
      icon: 'stack',
      title: 'Integrity',
      description:
        'Maintain the highest standards of honesty, transparency, and ethical conduct.',
    },
    {
      icon: 'star',
      title: 'Excellence',
      description:
        'Delivering unmatched quality and striving for superior outcomes in every product and service we offer',
    },
    {
      icon: 'users',
      title: 'Knowledge Sharing',
      description:
        'Building a community centered on collaboration, mutual growth, and the free exchange of ideas.',
    },
  ];
}
