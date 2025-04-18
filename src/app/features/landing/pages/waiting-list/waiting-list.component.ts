import { Component } from '@angular/core';
import { SubscribeFormComponent } from '../../components/subscribe-form/subscribe-form.component';
import { FlexLogoComponent } from '../../components/flex-logo/flex-logo.component';

@Component({
  selector: 'app-waiting-list',
  imports: [SubscribeFormComponent, FlexLogoComponent],
  templateUrl: './waiting-list.component.html',
  styleUrl: './waiting-list.component.scss',
})
export class WaitingListComponent {
  email: string = '';

  onSubmit() {
    // Handle the join waiting list submission
    console.log('Submitted email:', this.email);
    // Add your API call logic here
  }

  visible: boolean = false;
  errorMessage: string = '';

  showError(message: string) {
    this.errorMessage = message;
    this.visible = true;
  }
}
