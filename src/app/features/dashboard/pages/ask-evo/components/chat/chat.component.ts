import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {
  trigger,
  transition,
  style,
  stagger,
  animate,
  query,
  state,
} from '@angular/animations';
import autoTable from 'jspdf-autotable';
import { PdfService } from '../../../../../../shared/services/pdf.service';

// Extend the jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
    lastAutoTable: {
      finalY: number;
    };
  }
}

interface ChatMessage {
  sender: string; // Changed from union type to string to allow any sender
  consultantInfo?: any;
  text: string;
  timestamp: Date;
  displayText?: string;
  displayHtml?: SafeHtml;
  isTyping?: boolean;
}

interface ChatResponse {
  type: string;
  agent: string;
  content: string;
}

// New interface for the message queue
interface QueuedMessage {
  message: ChatMessage;
  callback?: () => void;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  animations: [
    trigger('fadeUpStagger', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('100ms', [
              animate(
                '300ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('typingAnimation', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('300ms ease-out')),
    ]),
  ],
})
export class ChatComponent implements OnInit, OnChanges {
  @Input() selectedFile: File | null = null;
  @Input() userQuestion: string = '';
  @Input() selectedConsultants: any = [];
  @Input() imageUrl: string = '';
  @Input() serviceId: string = '';
  @Input() chatResponse: any = null;
  @Input() responseDepthId: string = 'advanced'; // Add this input

  summarySection: boolean = true;
  conversationStarted: boolean = false;
  showFinalReport: boolean = false;
  isLoadingNextMessage: boolean = false;
  finalReportIsTyping: boolean = false;

  summaryTimestamp: Date = new Date();
  reportTimestamp: Date = new Date();

  chatMessages: ChatMessage[] = [];
  finalReportContent: string = '';
  finalReportDisplayText: string = '';
  finalReportHtml: SafeHtml = '';

  // Message queue and processing state
  private messageQueue: QueuedMessage[] = [];
  private isProcessingQueue: boolean = false;

  get consultantTypes(): string {
    return this.selectedConsultants.map((item: any) => item.type).join(', ');
  }

  isTyping: boolean = false;
  remainingTypingPeriod: number = 0; // Time left for typing effect
  typingSpeed: number = 10;

  constructor(
    private sanitizer: DomSanitizer,
    private pdfService: PdfService
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chatResponse'] && changes['chatResponse'].currentValue) {
      // console.log('chatResponse changed:', this.chatResponse);
      if (this.chatResponse) {
        // Process new chat response
        this.isLoadingNextMessage = false;
        this.processChatResponse(this.chatResponse);
      }
    }
  }

  processChatResponse(response: ChatResponse) {
    this.conversationStarted = true;

    // Check if this is a final report
    if (response.type === 'final_report') {
      // Store final report content but don't show it immediately
      this.finalReportContent = response.content;
      this.reportTimestamp = new Date();

      this.addToMessageQueue(
        {
          sender: 'system',
          text: 'final_report_marker',
          timestamp: new Date(),
        },
        () => {
          // Show and animate the final report only after all previous messages
          this.showFinalReport = true;
          this.finalReportIsTyping = true;
          this.animateFinalReport();
        }
      );
    } else {
      // Show loading indicator for the next message
      this.isLoadingNextMessage = true;

      // Create the message object with the actual agent name
      const newMessage: ChatMessage = {
        sender: response.agent, // Use the full agent name from response
        text: response.content,
        timestamp: new Date(),
        consultantInfo:
          response.agent.includes('Consultant') || response.agent.includes('Dr')
            ? { name: response.agent, description: response.agent }
            : null,
      };

      // Add to queue instead of immediately displaying
      this.addToMessageQueue(newMessage, () => {
        // Keep loading indicator visible after message is fully typed
        this.isLoadingNextMessage = true;
      });
    }
  }
  // Add a message to the queue and process it if not already processing
  addToMessageQueue(message: ChatMessage, callback?: () => void) {
    this.messageQueue.push({ message, callback });

    // Start processing the queue if not already doing so
    if (!this.isProcessingQueue) {
      this.processNextMessageInQueue();
    }
  }

  // Process the next message in the queue
  processNextMessageInQueue() {
    if (this.messageQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    const nextItem = this.messageQueue.shift();

    if (nextItem) {
      // Add the message to chat messages with typing effect
      this.addMessageWithTypingEffect(nextItem.message, () => {
        // Run callback if provided
        if (nextItem.callback) {
          nextItem.callback();
        }

        // Process next message after this one is complete
        this.processNextMessageInQueue();
      });
    }
  }

  // Animate final report with typing effect
  animateFinalReport() {
    let i = 0;
    const text = this.finalReportContent;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        this.finalReportDisplayText = text.substring(0, i + 1);
        this.finalReportHtml = this.sanitizer.bypassSecurityTrustHtml(
          marked.parse(this.finalReportDisplayText, { async: false })
        );
        i++;
      } else {
        clearInterval(typingInterval);
        this.finalReportIsTyping = false;
      }
    }, this.typingSpeed);
  }

  getConsultantInfo(agentId: string): any {
    const consultant = this.chatResponse.agent;
    return consultant
      ? { name: consultant, description: consultant }
      : { name: agentId, description: 'Unknown Consultant' };
  }

  //   getConsultantInfo(agentId: string): any {
  //   return {
  //     name: agentId,
  //     description: agentId.includes('Consultant') || agentId.includes('Dr') ?
  //                  agentId :
  //                  'Unknown Consultant'
  //   };
  // }

  addMessageWithTypingEffect(message: ChatMessage, callback: () => void) {
    // Check if this is a special marker for the final report
    if (message.sender === 'system' && message.text === 'final_report_marker') {
      // Don't add system messages to the chat
      if (callback) callback();
      return;
    }

    message.displayText = '';
    message.isTyping = true;
    this.chatMessages.push(message);
    this.isTyping = true;

    let i = 0;
    const text = message.text;
    this.remainingTypingPeriod = text.length * this.typingSpeed; // Calculate total typing time
    const typingInterval = setInterval(() => {
      this.remainingTypingPeriod -= this.typingSpeed; // Decrease remaining time
      if (i < text.length) {
        message.displayText = text.substring(0, i + 1);
        message.displayHtml = this.sanitizer.bypassSecurityTrustHtml(
          marked.parse(message.displayText, { async: false })
        );
        i++;
      } else {
        clearInterval(typingInterval);
        message.isTyping = false;
        this.isTyping = false;
        if (callback) callback();
      }
    }, this.typingSpeed);
  }

  // Function to simulate streaming message sequence
  // In a real application, this would be connected to your actual message stream
  simulateMessageStream(messages: ChatResponse[]) {
    let index = 0;

    const processNextMessage = () => {
      if (index < messages.length) {
        this.isLoadingNextMessage = false;
        this.processChatResponse(messages[index]);
        index++;

        if (index < messages.length) {
          // Always show loading indicator between messages
          setTimeout(() => {
            this.isLoadingNextMessage = true;
            setTimeout(processNextMessage, 1500);
          }, this.remainingTypingPeriod + 500);
        }
      }
    };

    processNextMessage();
  }

  suggestions: any[] = [
    {
      text: 'Summarize into a document & download?',
      icon: 'pi pi-download',
      action: () => this.downloadPdfSummary(),
    },
    {
      text: 'Drafting a proposal/presentation?',
      soon: 'coming soon',
      icon: 'pi pi-file',
    },
  ];

  downloadPdfSummary() {
    this.pdfService.downloadPdfSummary({
      userQuestion: this.userQuestion,
      selectedFile: this.selectedFile,
      selectedConsultants: this.selectedConsultants,
      chatMessages: this.chatMessages,
      finalReportContent: this.finalReportContent,
      chatResponse: this.chatResponse,
      parseMarkdownSections: this.parseMarkdownSections,
    });
  }

  // Helper function to parse markdown into sections
  parseMarkdownSections(
    markdownText: string
  ): { title: string; content: string }[] {
    if (!markdownText) return [];

    const sections = [];
    const lines = markdownText.split('\n');

    let currentSection = { title: '', content: '' } as {
      title: string;
      content: string;
    };
    let inSection = false;

    lines.forEach((line) => {
      // Check if line is a heading (starts with #)
      if (line.startsWith('# ')) {
        // If we're already in a section, push it to the array before starting a new one
        if (inSection) {
          sections.push({ ...currentSection });
        }

        currentSection = {
          title: line.substring(2).trim(),
          content: '',
        };
        inSection = true;
      }
      // Check if line is a subheading (starts with ##)
      else if (line.startsWith('## ')) {
        // If we're already in a section, push it to the array before starting a new one
        if (inSection && currentSection.content.trim()) {
          sections.push({ ...currentSection });
        }

        currentSection = {
          title: line.substring(3).trim(),
          content: '',
        };
        inSection = true;
      }
      // Otherwise, add to current section content
      else if (inSection) {
        currentSection.content += line + '\n';
      }
      // If no section has been started yet, create an untitled one
      else {
        currentSection = {
          title: '',
          content: line + '\\n',
        };
        inSection = true;
      }
    });

    // Add the last section
    if (inSection) {
      sections.push(currentSection);
    }

    return sections;
  }
}
