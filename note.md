<!-- ---------------------------------------chat component----------------------------- -->

.chat-container {
background-color: #f9f9f9;
}

.chat-messages {
scroll-behavior: smooth;
}

.message {
transition: opacity 0.3s ease;
}

// Typing indicator animation
.typing-dot {
width: 8px;
height: 8px;
background-color: #aaa;
border-radius: 50%;
display: inline-block;
margin-right: 3px;
animation: bounce 1s infinite;
}

.animation-delay-200 {
animation-delay: 0.2s;
}

.animation-delay-400 {
animation-delay: 0.4s;
}

@keyframes bounce {
0%,
100% {
transform: translateY(0);
}
50% {
transform: translateY(-5px);
}
}

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Consultant {
name: string;
role: string;
description: string;
}

interface ChatMessage {
sender: 'user' | 'evo' | 'consultant';
consultantInfo?: Consultant;
text: string;
timestamp: Date;
}

@Component({
selector: 'app-chat',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './chat.component.html',
styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
@Input() selectedFile: File | null = null;
@Input() userQuestion: string = '';
@Input() imageUrl: string = '';

chatMessages: ChatMessage[] = [];
newMessage: string = '';
consultants: Consultant[] = [
{
name: 'Alpha',
role: 'Marketing Specialist',
description:
'The document outlines a plan to increase market share by 15% in the next year, focusing on social media ad spend, influencer collaborations, and SEO. The total marketing budget is 15 million SAR, with a target cost per acquisition (CPA) of 50 SAR.',
},
{
name: 'Delta',
role: 'Brand Strategist',
description:
'Brand positioning is critical for sustained growth. While short-term acquisition metrics like CPA matter, consistent branding across channels and markets can lower acquisition costs over time and boost retention rates.',
},
];

isTyping: boolean = false;

ngOnInit() {
// Initialize with the welcome message and initial conversation
this.initializeChat();
}

initializeChat() {
// Add initial Evo message
this.chatMessages.push({
sender: 'evo',
text: "Here's my summary before we move forward:",
timestamp: new Date(),
});

    // Add summary points
    setTimeout(() => {
      this.chatMessages.push({
        sender: 'evo',
        text: `• You're asking for: ${
          this.userQuestion || "[User's ask summary]"
        }

• I've reviewed: ${this.selectedFile?.name || '[Document name/type]'}
• Suggested Consultants: [List of Consultants]

Does this match what you need?
Please confirm or go back to adjust your request!`,
timestamp: new Date(),
});

      // Simulate user confirmation
      setTimeout(() => {
        this.chatMessages.push({
          sender: 'user',
          text: 'Confirmed',
          timestamp: new Date(),
        });

        // Simulate Evo's first response
        setTimeout(() => {
          this.handleEvoResponse();
        }, 1000);
      }, 1500);
    }, 500);

}

handleEvoResponse() {
this.isTyping = true;

    setTimeout(() => {
      this.chatMessages.push({
        sender: 'evo',
        text: "Delta, great first point. Let's keep tying our strategies to measurable outcomes. Specifically, how can brand-building efforts lower CPA in both mature and emerging markets?",
        timestamp: new Date(),
      });

      this.isTyping = false;

      // Simulate consultant response
      setTimeout(() => {
        this.handleConsultantResponse(this.consultants[1]);

        // After first consultant, show second exchange
        setTimeout(() => {
          this.chatMessages.push({
            sender: 'evo',
            text: "Delta, great first point. Let's keep tying our strategies to measurable outcomes. Specifically, how can brand-building efforts lower CPA in both mature and emerging markets?",
            timestamp: new Date(),
          });

          setTimeout(() => {
            this.handleConsultantResponse(this.consultants[1], true);
          }, 1000);
        }, 2000);
      }, 1500);
    }, 1000);

}

handleConsultantResponse(
consultant: Consultant,
isSecondResponse: boolean = false
) {
const responseText = isSecondResponse
? 'Strong brand identity can reduce reliance on paid ads; recognition leads to more organic traffic and better conversions. We could see CPA drop by 10-15% after six months of consistent brand reinforcement across platforms.'
: consultant.description;

    this.chatMessages.push({
      sender: 'consultant',
      consultantInfo: consultant,
      text: responseText,
      timestamp: new Date(),
    });

}

sendMessage() {
if (this.newMessage.trim()) {
// Add user message
this.chatMessages.push({
sender: 'user',
text: this.newMessage,
timestamp: new Date(),
});

      // Clear input
      this.newMessage = '';

      // Simulate response
      this.isTyping = true;
      setTimeout(() => {
        this.isTyping = false;
        this.chatMessages.push({
          sender: 'evo',
          text: "I'll analyze that further with our consultants. Give me a moment...",
          timestamp: new Date(),
        });
      }, 1500);
    }

}
}

<div class="chat-container h-screen flex flex-col">
  <!-- Chat Header -->
  <div class="chat-header p-4 border-b">
    <h2 class="text-xl font-semibold">Ask Evo</h2>
    <div class="text-sm text-gray-500" *ngIf="selectedFile">
      Document: {{ selectedFile.name }}
    </div>
  </div>

  <!-- Chat Messages -->
  <div class="chat-messages flex-grow overflow-y-auto p-4">
    <div *ngFor="let message of chatMessages" class="message mb-4">
      <!-- EVO Messages -->
      <div *ngIf="message.sender === 'evo'" class="flex items-start">
        <div
          class="avatar bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2"
        >
          <span>E</span>
        </div>
        <div class="message-content max-w-3xl">
          <div class="font-semibold mb-1">Evo</div>
          <div class="bg-gray-100 rounded-lg p-3 whitespace-pre-line">
            {{ message.text }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ message.timestamp | date : "h:mm a" }}
          </div>
        </div>
      </div>

      <!-- User Messages -->
      <div
        *ngIf="message.sender === 'user'"
        class="flex items-start justify-end"
      >
        <div class="message-content max-w-3xl text-right">
          <div class="font-semibold mb-1">You</div>
          <div class="bg-blue-100 rounded-lg p-3 inline-block text-left">
            {{ message.text }}
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ message.timestamp | date : "h:mm a" }}
          </div>
        </div>
      </div>

      <!-- Consultant Messages -->
      <div
        *ngIf="message.sender === 'consultant'"
        class="flex items-start ml-10"
      >
        <div
          class="avatar bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2"
        >
          <span>{{ message.consultantInfo?.name!.charAt(0) }}</span>
        </div>
        <div class="message-content max-w-3xl">
          <div class="font-semibold mb-1">
            Consultant {{ message.consultantInfo?.name }} ({{
              message.consultantInfo?.role
            }})
          </div>
          <div class="bg-green-50 rounded-lg p-3">{{ message.text }}</div>
          <div class="text-xs text-gray-500 mt-1">
            {{ message.timestamp | date : "h:mm a" }}
          </div>
        </div>
      </div>
    </div>

    <!-- Typing indicator -->
    <div *ngIf="isTyping" class="flex items-center space-x-2 ml-10 mt-2">
      <div class="typing-dot"></div>
      <div class="typing-dot animation-delay-200"></div>
      <div class="typing-dot animation-delay-400"></div>
    </div>

  </div>

  <!-- Chat Input -->
  <div class="chat-input border-t p-4">
    <div class="flex">
      <input
        type="text"
        [(ngModel)]="newMessage"
        placeholder="Type your message here..."
        class="flex-grow p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        (keyup.enter)="sendMessage()"
      />
      <button
        class="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600"
        (click)="sendMessage()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"
          />
        </svg>
      </button>
    </div>
  </div>
</div>
<!-- ---------------------------------------chat component----------------------------- -->

<!-- ---------------------------------------Summary details----------------------------- -->
<div class="w-full h-screen mt-10">
  <div class="mb-6 px-10">
    <div class="flex items-center gap-5">
      <img src="images/new/circle.svg" alt="" />
      <h1 class="text-2xl font-bold mb-2">Summary of Your Request</h1>
    </div>

    <div class="mb-6 ms-12">
      <p class="text-[#667085] mb-6">
        Here's a summary of everything you've provided. Please review the
        details before proceeding to chat.
      </p>

      <!-- File Details -->
      <div class="mb-6 p-4 border border-[#EAECF0] rounded-lg">
        <h3 class="font-bold text-lg mb-2">Uploaded Document</h3>
        <div class="flex items-center gap-2">
          <i class="pi pi-file text-[#9241DC]"></i>
          <span>{{ fileName || "No file selected" }}</span>
          <span *ngIf="fileSize" class="text-sm text-[#667085]"
            >({{ fileSize }})</span
          >
        </div>
      </div>

      <!-- Question -->
      <div class="mb-6 p-4 border border-[#EAECF0] rounded-lg">
        <h3 class="font-bold text-lg mb-2">Your Question</h3>
        <p class="text-[#101828]">
          {{ userQuestion || "No question provided" }}
        </p>
      </div>

      <!-- Selected Consultants -->
      <div class="p-4 border border-[#EAECF0] rounded-lg">
        <h3 class="font-bold text-lg mb-4">
          Selected Consultants ({{ selectedConsultants.length }})
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            *ngFor="let consultant of selectedConsultants"
            class="flex items-start gap-3 p-3 rounded-lg bg-[#F9FAFB]"
          >
            <div
              class="bg-[#9241DC] p-2 w-[36px] h-[36px] rounded-xl flex justify-center items-center"
            >
              <i class="pi {{ consultant.icon }} text-white"></i>
            </div>
            <div>
              <h4 class="font-semibold">{{ consultant.type }}</h4>
              <p class="text-sm text-[#667085] line-clamp-1">
                {{ consultant.description }}
              </p>
            </div>
          </div>
        </div>

        <div
          *ngIf="selectedConsultants.length === 0"
          class="text-center p-4 text-[#667085]"
        >
          No consultants selected
        </div>
      </div>
    </div>

  </div>

  <div
    class="w-full"
    style="
      background-image: url('images/new/Background Chat.svg');
      background-repeat: no-repeat;
      background-size: cover;
    "
  >
    <div class="flex justify-between mt-8 ms-12 p-4">
      <button (click)="goToPreviousStep()">
        <i class="pi pi-arrow-left text-[#0F132499]/60"></i>
      </button>

      <div class="flex items-center gap-4">
        <button
          (click)="continueToNextStep()"
          class="px-6 py-3 bg-[#9241DC] text-white rounded-xl hover:bg-purple-700"
        >
          Start Chat
        </button>

        <button
          class="flex gap-2 items-start text-[#0F132499]/60 cursor-default"
        >
          <img src="images/curved-arrow.png" class="w-5 h-5" alt="" />
          press enter
        </button>
      </div>
    </div>

  </div>
</div>
<!-- ---------------------------------------Summary details----------------------------- -->

<!-- ==============================================consultants component ts ======================== -->

// import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AgentsService } from '../../../../services/agents.service';

// export interface Consultant {
// id: number;
// type: string;
// description: string;
// creator: {
// name: string;
// avatar: string | null;
// initial?: string;
// };
// likes: number;
// icon: string;
// selected?: boolean;
// profileId?: string;
// agentId?: string;
// }

// @Component({
// selector: 'app-consulting-suggestion',
// standalone: true,
// imports: [CommonModule],
// templateUrl: './consulting-suggestion.component.html',
// styleUrl: './consulting-suggestion.component.scss',
// })
// export class ConsultingSuggestionComponent implements OnInit {
// @Input() suggestedAgents: any[] = []; // Input to receive agents from parent component
// @Output() continue = new EventEmitter<void>();
// @Output() previous = new EventEmitter<void>();
// @Output() selectedConsultantsChange = new EventEmitter<Consultant[]>();

// private readonly maxSelectedConsultants = 3;

// suggestedConsultants: Consultant[] = [];
// otherConsultants: Consultant[] = [];

// currentPage = 1;
// itemsPerPage = 6;

// constructor(private agentService: AgentsService) {}

// ngOnInit() {
// // Transform input suggested agents into Consultant format
// if (this.suggestedAgents && this.suggestedAgents.length > 0) {
// this.suggestedConsultants = this.suggestedAgents
// .slice(0, 3)
// .map((agent, index) => ({
// id: index + 1,
// type: agent.name || 'Consultant',
// description: `${agent.persona} in ${agent.domain} located in ${agent.location}`,
// creator: {
// name: agent.name || 'Consultitude',
// avatar: 'images/new/circle.svg',
// },
// likes: 1,
// icon: this.getIconForIndex(index),
// selected: true,
// profileId: agent.profileId,
// agentId: agent.agentId,
// }));

// // If more than 3 agents, put the rest in otherConsultants
// if (this.suggestedAgents.length > 3) {
// this.otherConsultants = this.suggestedAgents
// .slice(3)
// .map((agent, index) => ({
// id: index + 4,
// type: agent.name || 'Consultant',
// description: `${agent.persona} in ${agent.domain} located in ${agent.location}`,
// creator: {
// name: agent.name || 'Consultitude',
// avatar: 'images/new/circle.svg',
// },
// likes: 1,
// icon: this.getIconForIndex(index),
// selected: false,
// profileId: agent.profileId,
// agentId: agent.agentId,
// }));
// }
// }
// }

// // Helper method to assign different icons
// private getIconForIndex(index: number): string {
// const icons = [
// 'pi-comments',
// 'pi-user',
// 'pi-clock',
// 'pi-inbox',
// 'pi-users',
// 'pi-chart-bar',
// ];
// return icons[index % icons.length];
// }

// // Existing methods remain the same as in the previous implementation
// get selectedConsultantsCount(): number {
// const suggestedSelected = this.suggestedConsultants.filter(
// (c) => c.selected
// ).length;
// const otherSelected = this.otherConsultants.filter(
// (c) => c.selected
// ).length;
// return suggestedSelected + otherSelected;
// }

// get totalConsultantsCount(): number {
// return this.suggestedConsultants.length + this.otherConsultants.length;
// }

// get allSelectedConsultants(): Consultant[] {
// const selectedFromSuggested = this.suggestedConsultants.filter(
// (c) => c.selected
// );
// const selectedFromOther = this.otherConsultants.filter((c) => c.selected);
// return [...selectedFromSuggested, ...selectedFromOther];
// }

// get paginatedConsultants() {
// const startIndex = (this.currentPage - 1) \* this.itemsPerPage;
// return this.otherConsultants.slice(
// startIndex,
// startIndex + this.itemsPerPage
// );
// }

// get totalPages() {
// return Math.ceil(this.otherConsultants.length / this.itemsPerPage);
// }

// toggleSuggestedSelection(consultant: Consultant) {
// if (
// !consultant.selected &&
// this.selectedConsultantsCount >= this.maxSelectedConsultants
// ) {
// return;
// }
// consultant.selected = !consultant.selected;
// this.selectedConsultantsChange.emit(this.allSelectedConsultants);
// }

// toggleOtherSelection(consultant: Consultant) {
// if (
// !consultant.selected &&
// this.selectedConsultantsCount >= this.maxSelectedConsultants
// ) {
// return;
// }
// consultant.selected = !consultant.selected;
// this.selectedConsultantsChange.emit(this.allSelectedConsultants);
// }

// nextPage() {
// if (this.currentPage < this.totalPages) {
// this.currentPage++;
// }
// }

// previousPage() {
// if (this.currentPage > 1) {
// this.currentPage--;
// }
// }

// goToPreviousStep() {
// this.previous.emit();
// }

// continueToNextStep() {
// this.selectedConsultantsChange.emit(this.allSelectedConsultants);
// this.continue.emit();
// }
// }

<!-- ======================================chat==================================================== -->

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
transition('_ => _', [
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

<!-- ======================================chat html============================== -->
<div
  class="chat-container px-10 big:px-[200px] w-full h-screen overflow-y-auto flex flex-col pt-24"
>
  <!-- Chat Messages -->
  <div class="chat-messages flex-grow p-4">
    <!-- Initial Summary -->
    <div *ngIf="summarySection" class="message mb-10">
      <div class="flex items-start">
        <div
          class="avatar bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-5"
        >
          <span>E</span>
        </div>
        <div class="message-content max-w-3xl text-[#344054] text-[14px]">
          <div class="whitespace-pre-line">
            <p>Here's my summary before we move forward:</p>
            <ul class="list-disc pl-5 mt-2">
              <li>
                You're asking for: {{ userQuestion || "[User's ask summary]" }}
              </li>
              <li>
                I've reviewed:
                {{ selectedFile?.name || "[Document name/type]" }}
              </li>
              <li>Suggested Consultants: [{{ consultantTypes }}]</li>
            </ul>
            <p class="mt-2">Does this match what you need?</p>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ summaryTimestamp | date : "h:mm a" }}
          </div>
        </div>
      </div>
    </div>

    <!-- Conversation Section -->
    <div
      *ngIf="conversationStarted"
      class="border border-[#F0F2F5] shadow-md w-full rounded-2xl p-5 mb-10 max-w-[744px]"
    >
      <div *ngFor="let message of chatMessages" class="message mb-5">
        <!-- EVO Messages -->
        <div *ngIf="message.sender === 'evo'" class="flex items-start">
          <div
            class="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-4"
          >
            <span>E</span>
          </div>
          <div class="message-content w-[80%]">
            <div class="font-semibold mb-2 text-[#19213D]">Evo</div>
            <div class="whitespace-pre-line text-[#344054] text-sm">
              <div [innerHTML]="message.displayHtml"></div>
              <span *ngIf="message.isTyping" class="typing-cursor"></span>
            </div>
            <div class="text-xs text-[#344054] mt-1">
              {{ message.timestamp | date : "h:mm a" }}
            </div>
          </div>
        </div>

        <!-- Consultant Messages -->
        <div *ngIf="message.sender === 'consultant'" class="flex items-start">
          <div class="w-6 h-6 overflow-hidden rounded-full bg-[#F6FAFF]">
            <img src="images/Frame.svg" class="w-full h-full block" alt="" />
          </div>
          <div class="message-content w-[80%] ml-4">
            <div class="font-semibold mb-2 text-[#19213D]">
              Consultant {{ message.consultantInfo?.name || "Unknown" }}
              <span *ngIf="message.consultantInfo?.description">
                ({{ message.consultantInfo.description }})
              </span>
            </div>
            <div class="whitespace-pre-line text-[#344054] text-sm">
              <div [innerHTML]="message.displayHtml"></div>
              <span *ngIf="message.isTyping" class="typing-cursor"></span>
            </div>
            <div class="text-xs text-[#344054] mt-1">
              {{ message.timestamp | date : "h:mm a" }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Final Report Section -->
    <div *ngIf="showFinalReport" class="message mb-6">
      <div class="flex items-start">
        <div
          class="avatar bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-4"
        >
          <span>E</span>
        </div>
        <div class="message-content max-w-3xl">
          <div class="whitespace-pre-line text-[#101828] text-sm">
            <p>
              We're all done! Below is a summary of your request, the key
              insights, and each Consultant's input. Review everything:
            </p>
            <ol class="list-decimal pl-5 mt-3 space-y-3">
              <li>
                <strong>Your Original Ask:</strong>
                <p>
                  {{
                    userQuestion ||
                      "[Restate the user's original question/request clearly and briefly]"
                  }}
                </p>
              </li>
              <li>
                <strong>Document Overview:</strong>
                <p>{{ documentSummary }}</p>
              </li>
              <li>
                <strong>Consultants Consulted:</strong>
                <p>{{ consultantTypes }}</p>
              </li>
              <li>
                <strong>The Summary for Your Ask:</strong>
                <p>{{ finalSummary }}</p>
              </li>
              <li>
                <strong>Consultant Opinions & Supporting Arguments:</strong>
                <div
                  *ngFor="let consultant of selectedConsultants"
                  class="mt-2"
                >
                  <p>
                    <strong>Consultant {{ consultant.type }}:</strong>
                    {{ consultant.description }}
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <div class="text-xs text-gray-500 mt-1">
            {{ reportTimestamp | date : "h:mm a" }}
          </div>
        </div>
      </div>
    </div>

    <div
      *ngIf="!conversationStarted"
      class="flex items-center space-x-2 ml-10 mt-2"
    >
      <div class="typing-dot"></div>
      <div class="typing-dot animation-delay-200"></div>
      <div class="typing-dot animation-delay-400"></div>
    </div>

  </div>

  <!-- Footer buttons -->
  <div
    *ngIf="showFinalReport"
    class="border-t p-4 flex justify-center space-x-4"
  >
    <div
      class="flex items-center gap-2 mb-4 w-full"
      [@fadeUpStagger]="suggestions.length"
    >
      <button
        *ngFor="let suggestion of suggestions"
        class="px-4 py-3 border border-[#EAECF0] text-sm rounded-full w-fit font-sans flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        [disabled]="suggestion.soon"
        (click)="suggestion.action ? suggestion.action() : null"
      >
        <i [class]="suggestion.icon" class="w-4 h-4 text-[#F04438]"></i>
        <span>{{ suggestion.text }}</span>
        <p
          *ngIf="suggestion.soon"
          class="bg-[#ECDFFB] text-[#5314A3] rounded-[99px] text-[12px] flex justify-center items-center w-[80px] p-[2px]"
        >
          {{ suggestion.soon }}
        </p>
      </button>
    </div>
  </div>
</div>
