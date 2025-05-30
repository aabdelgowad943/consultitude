import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [RouterModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  scrollToSection() {
    const element = document.getElementById('waiting-list');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
