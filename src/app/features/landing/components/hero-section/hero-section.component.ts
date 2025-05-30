import { Component } from '@angular/core';
import { FlexLogoComponent } from '../flex-logo/flex-logo.component';
import { SubscribeFormComponent } from '../subscribe-form/subscribe-form.component';
import { LogoComponent } from '../../../../shared/logo/logo.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-hero-section',
  imports: [
    FlexLogoComponent,
    SubscribeFormComponent,
    ToastModule,
    ErrorMessageDialogComponent,
    // OverlayImageForBackgroundComponent,
  ],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.scss',
  providers: [MessageService],
})
export class HeroSectionComponent {
  visible: boolean = false;
  errorMessage: string = '';

  showError(message: string) {
    this.errorMessage = message;
    this.visible = true;
  }
}
