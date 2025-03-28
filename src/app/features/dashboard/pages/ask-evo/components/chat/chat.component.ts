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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  sender: 'user' | 'evo' | 'consultant';
  consultantInfo?: any;
  text: string;
  timestamp: Date;
  displayText?: string;
  displayHtml?: SafeHtml;
  isTyping?: boolean;
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

  summarySection: boolean = true;
  conversationStarted: boolean = false;
  showFinalReport: boolean = false;

  summaryTimestamp: Date = new Date();
  reportTimestamp: Date = new Date();

  chatMessages: ChatMessage[] = [];

  get consultantTypes(): string {
    return this.selectedConsultants.map((item: any) => item.type).join(', ');
  }

  isTyping: boolean = false;
  typingSpeed: number = 20;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    console.log(
      'ChatComponent initialized with chatResponse:',
      this.chatResponse
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chatResponse'] && changes['chatResponse'].currentValue) {
      console.log('chatResponse changed:', this.chatResponse);
      if (this.chatResponse && this.chatResponse.data?.messages) {
        this.startConversation();
      }
    }
  }

  startConversation() {
    this.conversationStarted = true;
    console.log(
      'Starting conversation with messages:',
      this.chatResponse.data.messages
    );

    this.chatResponse.data.messages.forEach((message: any, index: number) => {
      const sender =
        message.agent.toLowerCase() === 'evo' ? 'evo' : 'consultant';
      setTimeout(() => {
        this.addMessageWithTypingEffect(
          {
            sender: sender,
            text: message.message,
            timestamp: new Date(),
            consultantInfo:
              sender === 'consultant'
                ? this.getConsultantInfo(message.agent)
                : null,
          },
          () => {
            if (index === this.chatResponse.data.messages.length - 1) {
              setTimeout(() => {
                this.showFinalReport = true;
                this.reportTimestamp = new Date();
              }, 500);
            }
          }
        );
      }, index * 1000); // Delay between messages
    });

    // console.log(
    //   'Chat messagesdddddddddddddddd:',
    //   this.chatResponse.data.messages
    // );
  }

  getConsultantInfo(agentId: string): any {
    const consultant = this.selectedConsultants.find(
      (c: any) => c.agentId === agentId || c.type === agentId // Match by agentId or type
    );
    return consultant
      ? { name: consultant.type, description: consultant.description }
      : { name: agentId, description: 'Unknown Consultant' };
  }

  get documentSummary(): string {
    return (
      this.chatResponse?.data?.summary ||
      'Document summary will be available after analysis.'
    );
  }

  get finalSummary(): string {
    return (
      this.chatResponse?.data?.recommendation ||
      'Recommendations will be available after the conversation.'
    );
  }

  addMessageWithTypingEffect(message: ChatMessage, callback: () => void) {
    message.displayText = '';
    message.isTyping = true;
    this.chatMessages.push(message);
    this.isTyping = true;

    let i = 0;
    const text = message.text;
    const typingInterval = setInterval(() => {
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

  // Function to download PDF summary
  downloadPdfSummary() {
    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add header with logo
    doc.setFillColor(81, 20, 163); // Purple color similar to Evo's theme
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Evo Consultation Summary', 10, 15);

    // Add timestamp
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    doc.setFontSize(10);
    doc.text(`Generated: ${currentDate} at ${currentTime}`, pageWidth - 70, 15);

    // Add user question section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Original Request', 10, 30);
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);

    const userQuestionLines = doc.splitTextToSize(
      this.userQuestion || '[No question provided]',
      pageWidth - 20
    );
    doc.text(userQuestionLines, 10, 40);

    let yPosition = 40 + userQuestionLines.length * 7;

    // Add document summary section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Document Overview', 10, yPosition + 10);
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);

    const documentSummaryLines = doc.splitTextToSize(
      this.documentSummary,
      pageWidth - 20
    );
    doc.text(documentSummaryLines, 10, yPosition + 20);

    yPosition = yPosition + 20 + documentSummaryLines.length * 7;

    // Add consultants section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Consultants Consultitude', 10, yPosition + 10);
    doc.setFontSize(12);

    // Check if we need a new page
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    // Create table for consultants
    const consultantTableData = this.selectedConsultants.map(
      (consultant: any) => [
        consultant.type,
        // consultant.role,
        consultant.description,
      ]
    );

    autoTable(doc, {
      startY: yPosition + 15,
      head: [['Consultant', 'Input']],
      body: consultantTableData,
      theme: 'grid',
      headStyles: { fillColor: [81, 20, 163], textColor: [255, 255, 255] },
      margin: { top: 10 },
    });

    yPosition = doc.lastAutoTable.finalY + 10;

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Add final summary section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Final Summary & Recommendations', 10, yPosition + 10);
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);

    const finalSummaryLines = doc.splitTextToSize(
      this.finalSummary,
      pageWidth - 20
    );
    doc.text(finalSummaryLines, 10, yPosition + 20);

    // Add conversation highlights if needed
    if (this.chatMessages.length > 0) {
      yPosition = yPosition + 20 + finalSummaryLines.length * 7 + 10;

      // Check if we need a new page
      if (yPosition > pageHeight - 70) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Conversation Highlights', 10, yPosition);

      const conversationData = this.chatMessages
        .filter((msg) => msg.sender !== 'user')
        .map((msg) => {
          let sender =
            msg.sender === 'evo' ? 'Evo' : `Consultant ${this.consultantTypes}`;
          return [
            sender,
            msg.text,
            new Date(msg.timestamp).toLocaleTimeString(),
          ];
        });

      autoTable(doc, {
        startY: yPosition + 5,
        head: [['Participant', 'Message', 'Time']],
        body: conversationData,
        theme: 'striped',
        headStyles: { fillColor: [81, 20, 163], textColor: [255, 255, 255] },
        margin: { top: 10 },
      });
    }

    // Save the PDF
    doc.save(
      `Evo_Consultation_Summary_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  }
}
