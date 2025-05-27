import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-mission-aspiration',
  imports: [CommonModule],
  templateUrl: './mission-aspiration.component.html',
  styleUrl: './mission-aspiration.component.scss',
})
export class MissionAspirationComponent {
  mission = {
    title: 'Our Mission',
    description:
      'We empower consultants, consulting organizations, and clients seeking expert advice to deliver impact. We will democratizes consulting practices, making top-tier tools and resources accessible to everyone.',
  };

  aspiration = {
    title: 'Our Aspiration...',
    description:
      'We aspire to revolutionize the consulting industry through creating a global community where access to premier consulting resources is universal. We envision a future where every consulting challenge is met with innovative and effective solutions, making excellence in consulting available to all.',
  };
}
