import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
} from '@angular/core';
import { HistoryComponent } from '../history/history.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { RapidResponseDialogComponent } from '../../../../components/rapid-response-dialog/rapid-response-dialog.component';
import { EvoServicesService } from '../../../../services/evo-services.service';
import { AgentsService } from '../../../../services/agents.service';
import { Route, Router, RouterModule } from '@angular/router';
import { CustomDatePipe } from '../../../../../../../shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-ask-evo-header',
  imports: [HistoryComponent, CommonModule, RouterModule, CustomDatePipe],
  templateUrl: './ask-evo-header.component.html',
  styleUrl: './ask-evo-header.component.scss',
})
export class AskEvoHeaderComponent implements OnInit {
  @Input() agents: any[] = [];
  @Input() conversations: any[] = [];
  @Output() showDocumentUploadStepper = new EventEmitter<boolean>();
  @Input() serviceId: string = '';
  @Output() serviceIdChange = new EventEmitter<string>();

  services: any;
  totalItems: number = 0;
  first: number = 0;
  pageSize: number = 3;

  userId: string = localStorage.getItem('userId') || '';

  // Add a cache for random icons to prevent regeneration
  private randomIconCache: { [key: string]: string } = {};

  onQuestionChange(value: string) {
    this.serviceId = value;
    this.serviceIdChange.emit(value);
  }

  constructor(
    private dialogService: DialogService,
    private evoService: EvoServicesService,
    private agentService: AgentsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.getAllServices();
    this.getAllAgents();
    this.getChatsByUserId();
  }

  ngOnInit() {
    // Pre-assign random icons to agents if needed
    if (this.agents.length > 0) {
      this.preAssignAgentIcons();
    }
  }

  preAssignAgentIcons() {
    // This ensures we generate random icons only once during initialization
    const iconName = this.iconName;
    const normalizedName = iconName?.toLowerCase() || '';

    if (!this.iconMap[normalizedName]) {
      // Generate a random icon once and cache it
      const randomIndex = Math.floor(
        Math.random() * this.availableIcons.length
      );
      this.randomIconCache[normalizedName] = this.availableIcons[randomIndex];
    }
  }

  getAllServices() {
    this.evoService.getAllServices(1, 10).subscribe({
      next: (res: any) => {
        this.services = res.data;
      },
    });
  }

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
        // After getting agents, pre-assign icons
        this.preAssignAgentIcons();
      },
      error: (err) => {
        // console.error('Error fetching agents', err);
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
    // Check window width to determine dialog width
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

  private openDocumentAnalysisDialog() {
    // Implement Document Analysis specific dialog/action
    // console.log('Opening Document Analysis Dialog');
  }

  private openConsultantBookingDialog() {
    // Implement Consultant Booking specific dialog/action
    // console.log('Opening Consultant Booking Dialog');
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
    this.router.navigate(['dashboard/view-chat-details', chatId], {
      queryParams: { chatId: chatId },
    });
  }

  @Input() iconName: string = '';

  // Mapping of icon names to asset paths
  private iconMap: { [key: string]: string } = {
    file: 'images/new/Icon-1.svg',
    document: 'images/new/Icon-2.svg',
    chart: 'images/new/Icon-3.svg',
    user: 'images/new/Icon-4.svg',
    // settings: 'images/new/Icon-5.svg',
    // download: 'images/new/Icon-6.svg',
    // upload: 'images/new/Icon-7.svg',
    // search: 'images/new/Icon-8.svg',
    // email: 'images/new/Icon-9.svg',
    // calendar: 'images/new/Icon-10.svg',
  };

  // Available icon paths for randomization
  private availableIcons: string[] = [
    'images/new/Icon-1.svg',
    'images/new/Icon-2.svg',
    'images/new/Icon-3.svg',
    'images/new/Icon-4.svg',
  ];

  getIconPath(iconName: string): string {
    // Convert to lowercase for case-insensitive matching
    const normalizedName = iconName?.toLowerCase() || '';

    // Check if the icon name exists in the map
    if (this.iconMap[normalizedName]) {
      return this.iconMap[normalizedName];
    }

    // Check if we already have a cached random icon for this name
    if (this.randomIconCache[normalizedName]) {
      return this.randomIconCache[normalizedName];
    }

    // Generate a random index to pick a random icon (only happens once per name)
    const randomIndex = Math.floor(Math.random() * this.availableIcons.length);
    this.randomIconCache[normalizedName] = this.availableIcons[randomIndex];

    // Return the cached random icon
    return this.randomIconCache[normalizedName];
  }
}
