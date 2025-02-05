import { Component } from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-contact-us',
  imports: [FooterComponent, NavbarComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  onSubmit() {
    console.log('Form submitted');
  }
}
