import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer-card',
  imports: [RouterModule],
  templateUrl: './footer-card.component.html',
  styleUrl: './footer-card.component.scss',
})
export class FooterCardComponent {
  scrollToSection() {
    const element = document.getElementById('waiting-list');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
