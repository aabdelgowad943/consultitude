import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  displayText?: string; // For typing animation
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
export class ChatComponent implements OnInit {
  @Input() selectedFile: File | null = null;
  @Input() userQuestion: string = '';
  @Input() selectedConsultants: any = [];
  @Input() imageUrl: string = '';
  @Input() serviceId: string = '';

  // Flags for different sections
  summarySection: boolean = true;
  conversationStarted: boolean = false;
  showFinalReport: boolean = false;

  // Timestamps
  summaryTimestamp: Date = new Date();
  reportTimestamp: Date = new Date();

  // Content
  chatMessages: ChatMessage[] = [];

  get consultantTypes(): string {
    return this.selectedConsultants.map((item: any) => item.type).join(', ');
  }

  documentSummary: string =
    'The document details a comprehensive marketing plan focusing on digital channels, CPA targets, and brand positioning strategies across multiple market segments.';

  finalSummary: string =
    'Based on the document analysis and consultant insights, a balanced approach of consistent brand messaging across channels while carefully monitoring CPA metrics is recommended. This strategy should achieve both short-term acquisition goals and build long-term brand value.';

  // Typing animation controls
  isTyping: boolean = false;
  typingSpeed: number = 20; // milliseconds per character

  ngOnInit() {
    // Show initial summary section
    setTimeout(() => {
      // After 3 seconds, start the conversation automatically
      this.startConversation();
    }, 3000);
  }

  startConversation() {
    this.conversationStarted = true;

    // First Evo message with typing animation
    this.addMessageWithTypingEffect(
      {
        sender: 'evo',
        text: "Delta, great first point. Let's keep tying our strategies to measurable outcomes. Specifically, how can brand-building efforts lower CPA in both mature and emerging markets?",
        timestamp: new Date(),
      },
      () => {
        // Alpha consultant response
        setTimeout(() => {
          this.addMessageWithTypingEffect(
            {
              sender: 'consultant',
              consultantInfo: this.consultantTypes[0],
              text: this.selectedConsultants[0].description,
              timestamp: new Date(),
            },
            () => {
              // Delta consultant response
              setTimeout(() => {
                this.addMessageWithTypingEffect(
                  {
                    sender: 'consultant',
                    consultantInfo: this.consultantTypes[1],
                    text: this.selectedConsultants[1].description,
                    timestamp: new Date(),
                  },
                  () => {
                    // Next Evo message
                    setTimeout(() => {
                      this.addMessageWithTypingEffect(
                        {
                          sender: 'evo',
                          text: "Delta, great first point. Let's keep tying our strategies to measurable outcomes. Specifically, how can brand-building efforts lower CPA in both mature and emerging markets?",
                          timestamp: new Date(),
                        },
                        () => {
                          // Final Delta response
                          setTimeout(() => {
                            this.addMessageWithTypingEffect(
                              {
                                sender: 'consultant',
                                consultantInfo: this.consultantTypes[1],

                                text: 'Strong brand identity can reduce reliance on paid ads; recognition leads to more organic traffic and better conversions. We could see CPA drop by 10-15% after six months of consistent brand reinforcement across platforms.',
                                timestamp: new Date(),
                              },
                              () => {
                                // Show final report after the conversation
                                setTimeout(() => {
                                  this.showFinalReport = true;
                                  this.reportTimestamp = new Date();
                                }, 500);
                              }
                            );
                          }, 1000);
                        }
                      );
                    }, 1000);
                  }
                );
              }, 1000);
            }
          );
        }, 1000);
      }
    );
  }

  // Method to handle typing animation
  addMessageWithTypingEffect(message: ChatMessage, callback: () => void) {
    // Add message with empty display text and typing flag
    message.displayText = '';
    message.isTyping = true;
    this.chatMessages.push(message);
    this.isTyping = true;

    // Start typing animation
    let i = 0;
    const text = message.text;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        message.displayText = text.substring(0, i + 1);
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
