import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { HistoryComponent } from '../history/history.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { RapidResponseDialogComponent } from '../../../../components/rapid-response-dialog/rapid-response-dialog.component';
import { EvoServicesService } from '../../../../services/evo-services.service';
import { Router, RouterModule } from '@angular/router';
import { TalkToConsultantComponent } from '../../../../components/talk-to-consultant/talk-to-consultant.component';
import { FormsModule } from '@angular/forms';

import { trigger, transition, style, animate } from '@angular/animations';
import { HeaderSectionForEvoComponent } from '../header-section-for-evo/header-section-for-evo.component';

@Component({
  selector: 'app-ask-evo-header',
  imports: [
    HistoryComponent,
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderSectionForEvoComponent,
  ],
  templateUrl: './ask-evo-header.component.html',
  styleUrl: './ask-evo-header.component.scss',
  animations: [
    trigger('errorAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        ),
      ]),
    ]),
  ],
})
export class AskEvoHeaderComponent implements OnInit {
  @Input() conversations: any[] = [];
  @Output() showDocumentUploadStepper = new EventEmitter<boolean>();
  @Input() serviceId: string = '';
  @Output() serviceIdChange = new EventEmitter<string>();
  services: any;
  userId: string = localStorage.getItem('userId') || '';

  onQuestionChange(value: string) {
    this.serviceId = value;
    this.serviceIdChange.emit(value);
  }

  constructor(
    private dialogService: DialogService,
    private evoService: EvoServicesService,
    private router: Router
  ) {
    this.getAllServices();
    this.getChatsByUserId();
  }

  ngOnInit() {}

  getAllServices() {
    this.evoService.getAllServices(1, 10).subscribe({
      next: (res: any) => {
        this.services = res.data;
      },
    });
  }

  getBackgroundImage(serviceName: string): string {
    serviceName = serviceName.toLowerCase();
    if (serviceName.includes('rapid')) {
      return 'images/new/Rapid Response BG.svg';
    } else if (serviceName.includes('analyze')) {
      return 'images/new/Analyze a Document BG.svg';
    } else if (serviceName.includes('talk')) {
      return 'images/new/Talk to Consultant BG.svg';
    }
    return 'images/new/Rapid Response BG.svg';
  }

  getIcons(serviceName: string): string {
    serviceName = serviceName.toLowerCase();
    if (serviceName.includes('rapid')) {
      return 'images/new/Vector.svg';
    } else if (serviceName.includes('analyze')) {
      return 'images/analyze doc.svg';
    } else if (serviceName.includes('talk')) {
      return 'images/new/Frame.svg';
    }
    return 'images/new/Frame.svg';
  }

  getCreditTextColor(serviceName: string): string {
    serviceName = serviceName.toLowerCase();
    if (serviceName.includes('rapid')) {
      return 'text-[#792EBA]';
    } else if (serviceName.includes('analyze')) {
      return 'text-[#D92D20]';
    } else if (serviceName.includes('talk')) {
      return 'text-[#DC6803]';
    }
    return 'text-[#792EBA]'; // default color
  }

  getServiceDescription(serviceName: string): string {
    serviceName = serviceName.toLowerCase();
    if (serviceName.includes('rapid')) {
      return 'Quickly extract key insights, summaries, or action items.';
    } else if (serviceName.includes('analyze')) {
      return 'Extra key takeaways & recommendations from your documents';
    } else if (serviceName.includes('talk')) {
      return 'Engage with specialized AI consultant';
    }
    return 'Service description not available.';
  }

  handleServiceClick(service: any) {
    this.serviceId = service.id;
    this.serviceIdChange.emit(service.id);
    console.log('service id', this.serviceId);

    switch (service.name.toLowerCase()) {
      case 'rapid response':
        this.openRapidResponseDialog();
        break;
      case 'analyze document':
        this.openDocumentAnalysisDialog();
        break;
      case 'talk to consultant':
        this.openConsultantBookingDialog();
        break;
      default:
      // console.log('Unknown service');
    }
  }

  openRapidResponseDialog() {
    const isMobile = window.innerWidth < 768;
    const dialogWidth = isMobile ? '300px' : '602px';
    const dialogRef = this.dialogService.open(RapidResponseDialogComponent, {
      header: '',
      width: dialogWidth,
      height: 'auto',
      contentStyle: {
        'border-radius': '10px',
        padding: '0px',
        'overflow-y': 'auto',
        'scrollbar-width': 'none',
        '-ms-overflow-style': 'none',
      },
      showHeader: false,
      breakpoints: {
        '768px': '300px', // Set width to 200px for screen width <= 768px
        '992px': '600px', // Optional: medium screens
      },
      style: {
        'max-width': '90vw', // Prevents dialog from exceeding viewport width
      },
    });

    dialogRef.onClose.subscribe((result) => {
      if (result && result.showStepper) {
        // Emit an event to parent component to show stepper
        this.showDocumentUploadStepper.emit(true);
      }
    });
  }

  private openConsultantBookingDialog() {
    // Check window width to determine dialog width
    const isMobile = window.innerWidth < 768;
    const dialogWidth = isMobile ? '300px' : '602px';

    const dialogRef = this.dialogService.open(TalkToConsultantComponent, {
      header: '',
      width: dialogWidth,
      height: 'auto',
      contentStyle: {
        'border-radius': '10px',
        padding: '0px',
        'overflow-y': 'auto',
        'scrollbar-width': 'none',
        '-ms-overflow-style': 'none',
      },
      showHeader: false,
      breakpoints: {
        '768px': '300px',
        '992px': '600px',
      },
      style: {
        'max-width': '90vw',
      },
      data: {
        serviceId: this.serviceId,
      },
    });

    dialogRef.onClose.subscribe((result) => {
      if (result && result.showStepper) {
        // Navigate to TalkToAiConsultantComponent instead of showing stepper here
        this.router.navigate(['dashboard', 'talk-to-ai-consultant']);
      }
    });

    // localStorage.setItem('serviceId', this.serviceId);
    // console.log(this.serviceId);
  }

  private openDocumentAnalysisDialog() {
    // console.log('Opening Document Analysis Dialog');
  }

  getChatsByUserId() {
    this.evoService.getChatsByUserId(this.userId, 1, 5).subscribe({
      next: (res: any) => {
        this.conversations = res.data;
        console.log(this.conversations);
      },
    });
  }

  viewChatHistory(chatId: string) {
    // Make sure chatId is not null or undefined
    if (!chatId) {
      console.error('Invalid chatId:', chatId);
      return;
    }

    this.router.navigate(['dashboard', 'view-chat-details', chatId]);
  }
}
