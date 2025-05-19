// header-section-for-evo.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  Renderer2, // Import Renderer2 for DOM manipulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Consultant } from '../../../../models/consultant';
import { AgentsService } from '../../../../services/agents.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SelectConsultantForChatComponent } from '../select-consultant-for-chat/select-consultant-for-chat.component';
import { PassDataForChatService } from '../../../../services/pass-data-for-chat.service';
import { Router } from '@angular/router';
import { ProfileServiceService } from '../../../../services/profile-service.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-header-section-for-evo',
  imports: [CommonModule, FormsModule],
  templateUrl: './header-section-for-evo.component.html',
  styleUrl: './header-section-for-evo.component.scss',
})
export class HeaderSectionForEvoComponent implements OnInit {
  name: string = '';
  @Input() userInput: string = '';
  @Input() agents: any[] = [];
  selectedAgentId: any;
  selectedConsultant: Consultant | null = null;
  @Input() iconName: string = '';

  // Track the element reference to the currently active agent element
  private activeAgentElement: HTMLElement | null = null;

  // CSS class names for active and inactive states
  private readonly ACTIVE_AGENT_CLASS = 'active-agent';
  private readonly ACTIVE_BORDER_CLASS = 'active-agent-border';
  private readonly ACTIVE_BG_CLASS = 'active-agent-bg';

  // Mapping of icon names to asset paths
  private iconMap: { [key: string]: string } = {
    file: 'images/new/Icon-1.svg',
    document: 'images/new/Icon-2.svg',
    chart: 'images/new/Icon-3.svg',
    user: 'images/new/Icon-4.svg',
  };

  // Available icon paths for randomization
  private availableIcons: string[] = [
    'images/landing/Option Icon.svg',
    'images/landing/Option Icon2.svg',
    'images/landing/Option Icon.svg',
    'images/landing/Option Icon2.svg',
  ];

  // Add a cache for random icons to prevent regeneration
  private randomIconCache: { [key: string]: string } = {};

  totalItems: number = 0;
  first: number = 0;
  pageSize: number = 3;

  // File upload related properties
  @Output() uploadError = new EventEmitter<string>();
  @Input() selectedFile: File | null = null;
  @Output() fileSelected = new EventEmitter<File>();
  @Input() isUploading = false;
  @Input() uploadProgress = 0;
  @Input() errorMessage: string | null = null;
  private errorTimeout: any; // To store the timeout reference
  @Output() uploadComplete = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() fileRemove = new EventEmitter<void>();
  @Output() fileUploaded = new EventEmitter<string>();

  // Add property to store the uploaded file URL
  uploadedFileUrl: string = '';

  constructor(
    private agentService: AgentsService,
    private dialogService: DialogService,
    private passDataForChatService: PassDataForChatService,
    private router: Router,
    private profileService: ProfileServiceService,
    private renderer: Renderer2 // Inject Renderer2 for DOM manipulation
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.name =
        localStorage.getItem('firstName') +
        ' ' +
        localStorage.getItem('lastName');
    }, 400);

    if (this.agents.length > 0) {
      this.preAssignAgentIcons();
    }
    this.getAllAgents();

    // Add custom CSS classes to the document if they don't exist
    this.addStylesIfNeeded();
  }

  // Method to add custom classes to document if they don't exist
  private addStylesIfNeeded(): void {
    const styleId = 'agent-selection-styles';

    // Check if styles already exist
    if (!document.getElementById(styleId)) {
      const styleEl = this.renderer.createElement('style');
      this.renderer.setAttribute(styleEl, 'id', styleId);

      // Define our custom styles
      const css = `
        .active-agent-border {
          border-color: #FFCCF2 !important;
        }

        .active-agent-bg {
          background-image: linear-gradient(to top right, #291738, #7016bf) !important;
        }

        .agent-item {
          transition: all 0.2s ease-in-out;
        }
      `;

      this.renderer.appendChild(styleEl, this.renderer.createText(css));
      this.renderer.appendChild(document.head, styleEl);
    }
  }

  getAllAgents(params: any = {}) {
    const currentPage = Math.floor(this.first / this.pageSize) + 1;
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
        this.preAssignAgentIcons();

        // If we had a previously selected agent, check if it's in the new list and update styling
        this.syncSelectedAgentWithUI();
      },
      error: (err) => {},
    });
  }

  preAssignAgentIcons() {
    // This ensures we generate random icons only once during initialization
    const iconName = this.iconName;
    const normalizedName = iconName?.toLowerCase() || '';
    if (!this.iconMap[normalizedName]) {
      const randomIndex = Math.floor(
        Math.random() * this.availableIcons.length
      );
      this.randomIconCache[normalizedName] = this.availableIcons[randomIndex];
    }
  }

  openAiConsultantDialog() {
    const isMobile = window.innerWidth < 768;
    const dialogWidth = isMobile ? '370px' : '702px';
    const ref = this.dialogService.open(SelectConsultantForChatComponent, {
      header: 'Select a Consultant',
      width: dialogWidth,
      contentStyle: { 'max-height': '80vh', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        selectedConsultant: this.selectedConsultant,
      },
      height: '90%',
    });

    ref.onClose.subscribe((newConsultant: Consultant | null) => {
      if (newConsultant !== undefined) {
        // Update the selected consultant
        this.selectedConsultant = newConsultant;

        // Update the selectedAgentId to match the consultant's agentId
        if (newConsultant) {
          // Save previous agent ID
          const previousAgentId = this.selectedAgentId;

          // Set new agent ID
          this.selectedAgentId = newConsultant.agentId;

          // Update UI to reflect changes
          this.syncSelectedAgentWithUI();
        } else {
          // Clear selection if consultant was removed
          this.clearAgentSelection();
        }
      }
    });
  }

  // Clear active styling from the DOM
  private clearAgentSelection(): void {
    // Clear the active reference
    if (this.activeAgentElement) {
      this.renderer.removeClass(
        this.activeAgentElement,
        this.ACTIVE_AGENT_CLASS
      );
      this.renderer.removeClass(
        this.activeAgentElement,
        this.ACTIVE_BORDER_CLASS
      );
      this.renderer.removeClass(this.activeAgentElement, this.ACTIVE_BG_CLASS);
      this.activeAgentElement = null;
    }

    // Clear the data model
    this.selectedAgentId = null;
    this.selectedConsultant = null;
  }

  // Apply active styling to element
  private applyActiveStyles(element: HTMLElement): void {
    // First clear any existing active styles
    this.clearAgentSelection();

    // Apply new styles
    this.renderer.addClass(element, this.ACTIVE_AGENT_CLASS);
    this.renderer.addClass(element, this.ACTIVE_BORDER_CLASS);
    this.renderer.addClass(element, this.ACTIVE_BG_CLASS);

    // Store the element reference
    this.activeAgentElement = element;
  }

  // Synchronize the active agent in the UI based on selectedAgentId
  private syncSelectedAgentWithUI(): void {
    // We need to wait for the DOM to update with the latest agents
    setTimeout(() => {
      if (this.selectedAgentId) {
        // Find the agent element with this ID
        const agentElements = document.querySelectorAll('.agent-item');
        let found = false;

        agentElements.forEach((el: Element) => {
          const agentId = el.getAttribute('data-agent-id');

          if (agentId === this.selectedAgentId) {
            this.applyActiveStyles(el as HTMLElement);
            found = true;
          }
        });

        // If the agent isn't found in the list (it's only in the popup), we don't change visual state
      } else {
        // No agent selected, clear all selections
        this.clearAgentSelection();
      }
    }, 0);
  }

  selectAgent(agent: any, event: Event) {
    // Get the element that was clicked
    const clickedElement = event.currentTarget as HTMLElement;

    // If clicking the same agent, deselect it
    if (this.selectedAgentId === agent.id) {
      this.clearAgentSelection();
    } else {
      // Update the model
      this.selectedAgentId = agent.id;

      // Set the selected consultant based on the agent
      this.selectedConsultant = {
        agentId: agent.id,
        name: agent.name,
      } as any;

      // Update the UI
      this.applyActiveStyles(clickedElement);
    }
  }

  sendMessage() {
    if (
      (this.selectedConsultant || this.selectedAgentId) &&
      this.userInput.trim() !== ''
    ) {
      const consultantToUse = this.selectedConsultant || {
        agentId: this.selectedAgentId,
      };

      // Store data in the service before navigating
      this.passDataForChatService.setChatData({
        consultantAgentId: consultantToUse.agentId,
        userQuestion: this.userInput.trim(),
        selectedConsultant: consultantToUse,
        imageUrl: this.uploadedFileUrl,
      });

      this.router.navigate(['dashboard', 'talk-to-agent']);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File) {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      this.uploadError.emit(
        'Please select a PDF, Word document, or text file.'
      );
      return;
    }

    this.selectedFile = file;
    this.fileSelected.emit(file);
    this.uploadFile(file);
  }

  private uploadFile(file: File) {
    this.isUploading = true;
    this.errorMessage = null;
    this.uploadProgress = 0;
    this.uploadedFileUrl = '';

    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    const formData = new FormData();
    formData.append('file', file);

    this.profileService
      .uploadFile(formData)
      .pipe(
        finalize(() => {
          if (this.uploadProgress < 100) {
            this.isUploading = false;
          }
        })
      )
      .subscribe({
        next: (response) => {
          if (response && response.progress) {
            this.uploadProgress = response.progress;
          } else {
            this.uploadProgress = 100;
            setTimeout(() => {
              this.isUploading = false;
              this.uploadedFileUrl = response.Location; // Store the file URL when upload is complete
              this.uploadComplete.emit(response.Location);
              this.fileUploaded.emit(response.Location);
            }, 500);
          }
        },
        error: (error) => {
          const errorMessage =
            error.error.message || 'Failed to upload file. Please try again.';
          this.showError(errorMessage);
          this.selectedFile = null;
          this.uploadedFileUrl = ''; // Reset the URL on error
        },
      });
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.uploadError.emit(message);

    // Clear any existing timeout
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }

    // Set timeout to hide error after 2 seconds
    this.errorTimeout = setTimeout(() => {
      this.errorMessage = null;
      this.errorTimeout = null;
    }, 2000);
  }

  removeFile() {
    this.selectedFile = null;
    this.uploadedFileUrl = ''; // Reset the URL when file is removed
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
    this.fileRemove.emit();
  }

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
}
