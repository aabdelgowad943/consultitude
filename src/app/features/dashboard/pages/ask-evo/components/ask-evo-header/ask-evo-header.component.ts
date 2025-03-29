import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HistoryComponent } from '../history/history.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { RapidResponseDialogComponent } from '../../../../components/rapid-response-dialog/rapid-response-dialog.component';
import { EvoServicesService } from '../../../../services/evo-services.service';
import { AgentsService } from '../../../../services/agents.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ask-evo-header',
  imports: [HistoryComponent, CommonModule, RouterModule],
  templateUrl: './ask-evo-header.component.html',
  styleUrl: './ask-evo-header.component.scss',
})
export class AskEvoHeaderComponent {
  @Input() agents: any[] = [];
  @Input() conversations: any[] = [];
  @Output() showDocumentUploadStepper = new EventEmitter<boolean>();
  services: any;
  @Input() serviceId: string = '';

  @Output() serviceIdChange = new EventEmitter<string>();

  onQuestionChange(value: string) {
    this.serviceId = value;
    this.serviceIdChange.emit(value);
  }

  constructor(
    private dialogService: DialogService,
    private evoService: EvoServicesService,
    private agentService: AgentsService
  ) {
    this.getAllServices();
    this.getAllAgents();
  }

  getAllServices() {
    this.evoService.getAllServices(1, 10).subscribe({
      next: (res: any) => {
        this.services = res.data;
      },
    });
  }

  totalItems: number = 0;
  first: number = 0;
  pageSize: number = 3;
  getAllAgents(params: any = {}) {
    const currentPage = Math.floor(this.first / this.pageSize) + 1;

    // Prepare filter parameters
    const filterParams: any = {
      page: currentPage,
      limit: this.pageSize,
    };

    // Merge any additional params (like search)
    Object.assign(filterParams, params);

    this.agentService.getAllAgents(filterParams).subscribe({
      next: (res: any) => {
        this.agents = res.data;
        this.totalItems = res.meta.totalItems;
        // console.log('Agents:', this.agents);
      },
      error: (err) => {
        console.error('Error fetching agents', err);
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

  getServiceDescription(serviceName: string): string {
    serviceName = serviceName.toLowerCase();
    if (serviceName.includes('rapid')) {
      return 'Quickly extract key insights, summaries, or action items.';
    } else if (serviceName.includes('analyze')) {
      return ' Extra key takeaways & recommendations from your documents';
    } else if (serviceName.includes('talk')) {
      return 'Engage with specialized AI consultant';
    }
    return 'Service description not available.';
  }

  handleServiceClick(service: any) {
    this.serviceId = service.id;
    this.serviceIdChange.emit(service.id);

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
        console.log('Unknown service');
    }
  }

  openRapidResponseDialog() {
    const dialogRef = this.dialogService.open(RapidResponseDialogComponent, {
      header: '',
      width: '600px',
      contentStyle: {
        'border-radius': '20px',
        padding: '0px',
        'overflow-y': 'auto',
        'scrollbar-width': 'none',
        '-ms-overflow-style': 'none',
      },
      showHeader: false,
    });

    dialogRef.onClose.subscribe((result) => {
      if (result && result.showStepper) {
        // Emit an event to parent component to show stepper
        this.showDocumentUploadStepper.emit(true);
      }
    });
  }

  private openDocumentAnalysisDialog() {
    // Implement Document Analysis specific dialog/action
    // console.log('Opening Document Analysis Dialog');
  }

  private openConsultantBookingDialog() {
    // Implement Consultant Booking specific dialog/action
    // console.log('Opening Consultant Booking Dialog');
  }
}
