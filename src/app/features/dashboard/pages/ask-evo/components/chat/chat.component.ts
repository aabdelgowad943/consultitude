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

interface ChatResponse {
  type: string;
  agent: string;
  content: string;
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
  isLoadingNextMessage: boolean = false;
  finalReportIsTyping: boolean = false;

  summaryTimestamp: Date = new Date();
  reportTimestamp: Date = new Date();

  chatMessages: ChatMessage[] = [];
  finalReportContent: string = '';
  finalReportDisplayText: string = '';
  finalReportHtml: SafeHtml = '';

  get consultantTypes(): string {
    return this.selectedConsultants.map((item: any) => item.type).join(', ');
  }

  isTyping: boolean = false;
  remainingTypingPeriod: number = 0; // Time left for typing effect
  typingSpeed: number = 10;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    // console.log(
    //   'ChatComponent initialized with chatResponse:',
    //   this.chatResponse
    // );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chatResponse'] && changes['chatResponse'].currentValue) {
      // console.log('chatResponse changed:', this.chatResponse);
      if (this.chatResponse) {
        // Always show loading indicator when new message is coming
        this.isLoadingNextMessage = false;
        this.processChatResponse(this.chatResponse);
      }
    }
  }

  processChatResponse(response: ChatResponse) {
    this.conversationStarted = true;

    // Check if this is a final report
    if (response.type === 'final_report') {
      // Store final report content
      this.finalReportContent = response.content;
      this.reportTimestamp = new Date();

      // Start typing animation for final report
      this.showFinalReport = true;
      this.finalReportIsTyping = true;
      this.animateFinalReport();
    } else {
      // Show loading indicator for the next message
      this.isLoadingNextMessage = true;

      // Process regular message
      const sender =
        response.agent.toLowerCase() === 'evo' ? 'evo' : 'consultant';
      this.addMessageWithTypingEffect(
        {
          sender: sender,
          text: response.content,
          timestamp: new Date(),
          consultantInfo:
            sender === 'consultant'
              ? this.getConsultantInfo(response.agent)
              : null,
        },
        () => {
          // Keep loading indicator visible after message is fully typed
          this.isLoadingNextMessage = true;
        }
      );
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

  get documentSummary(): string {
    return (
      this.chatResponse?.data?.summary ||
      'Document summary will be available after analysis.'
    );
  }

  get finalSummary(): string {
    return (
      this.chatResponse?.content ||
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

    // Add document name section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Document Name', 10, yPosition + 10);
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);

    const fileNameLines = doc.splitTextToSize(
      this.selectedFile?.name || '[No file selected]',
      pageWidth - 20
    );
    doc.text(fileNameLines, 10, yPosition + 20);
    yPosition = yPosition + 20 + fileNameLines.length! * 7; // Adjust for the height of the text

    // Add consultants section
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Consultants Involved', 10, yPosition + 10);
    doc.setFontSize(12);

    // Check if we need a new page
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    // Create table for consultants
    const consultantTableData = this.selectedConsultants.map(
      (consultant: any) => [consultant.type, consultant.description]
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

    // Add conversation highlights if needed
    if (this.chatMessages.length > 0) {
      // Check if we need a new page
      if (yPosition > pageHeight - 70) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Conversation Highlights', 10, yPosition);

      // FIXED: Correctly map each message to display the proper agent name
      const conversationData = this.chatMessages
        .filter((msg) => msg.sender !== 'user')
        .map((msg) => {
          // For 'evo' messages, use 'Evo'
          // For 'consultant' messages, use the specific consultant name from consultantInfo
          const sender =
            msg.sender === 'evo'
              ? 'Evo'
              : msg.consultantInfo?.name || 'Consultant';

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

      yPosition = doc.lastAutoTable.finalY + 10;
    }

    // Always start the final report section on a new page
    doc.addPage();

    // Add Final Summary & Recommendations section with better formatting
    doc.setFillColor(245, 247, 250); // Light background for the header
    doc.rect(0, 0, pageWidth, 30, 'F');

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('Final Summary & Recommendations', pageWidth / 2, 20, {
      align: 'center',
    });

    // Get the final report content
    const finalReportContent =
      this.finalReportContent ||
      this.chatResponse?.content ||
      'No final recommendations available';

    // Parse markdown to extract sections
    const sections = this.parseMarkdownSections(finalReportContent);

    let currentY = 40;

    // Render each section with proper formatting
    sections.forEach((section) => {
      // Add section title
      if (section.title) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(81, 20, 163); // Purple color for headings
        doc.text(section.title, 10, currentY);
        currentY += 10;
      }

      // Add section content
      if (section.content) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);

        // Handle bullet points
        const contentLines = section.content.split('\\n');
        contentLines.forEach((line) => {
          // Check if line is a bullet point
          if (line.trim().startsWith('- ')) {
            const bulletText = line.trim().substring(2);
            const formattedLines = doc.splitTextToSize(
              bulletText,
              pageWidth - 30
            );
            doc.text('•', 15, currentY);
            doc.text(formattedLines, 20, currentY);
            currentY += formattedLines.length * 7;
          } else {
            const formattedLines = doc.splitTextToSize(line, pageWidth - 20);
            doc.text(formattedLines, 10, currentY);
            currentY += formattedLines.length * 7;
          }

          // Add some spacing between paragraphs
          currentY += 3;

          // Check if we need a new page
          if (currentY > pageHeight - 20) {
            doc.addPage();
            currentY = 20;
          }
        });
      }

      // Add separator between sections
      doc.setDrawColor(200, 200, 200);
      doc.line(10, currentY, pageWidth - 10, currentY);
      currentY += 10;

      // Check if we need a new page
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 20;
      }
    });

    // Save the PDF
    doc.save(
      `Evo_Consultation_Summary_${new Date().toISOString().slice(0, 10)}.pdf`
    );
  }

  // Helper function to parse markdown into sections
  parseMarkdownSections(
    markdownText: string
  ): { title?: string; content?: string }[] {
    if (!markdownText) return [];

    const sections = [];
    const lines = markdownText.split('\n');

    let currentSection = { title: '', content: '' };
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
        currentSection.content += line + '\\n';
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
