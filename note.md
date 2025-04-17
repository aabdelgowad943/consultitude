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
    <h2 class="text-xl ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]  ">Ask Evo</h2>
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
          <div class="ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]   mb-1">Evo</div>
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
          <div class="ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]   mb-1">You</div>
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
          <div class="ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]   mb-1">
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
      <h1 class="text-2xl ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]   mb-2">Summary of Your Request</h1>
    </div>

    <div class="mb-6 ms-12">
      <p class="text-[#667085] mb-6">
        Here's a summary of everything you've provided. Please review the
        details before proceeding to chat.
      </p>

      <!-- File Details -->
      <div class="mb-6 p-4 border border-[#EAECF0] rounded-lg">
        <h3 class="ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]   text-lg mb-2">Uploaded Document</h3>
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
        <h3 class="ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]   text-lg mb-2">Your Question</h3>
        <p class="text-[#101828]">
          {{ userQuestion || "No question provided" }}
        </p>
      </div>

      <!-- Selected Consultants -->
      <div class="p-4 border border-[#EAECF0] rounded-lg">
        <h3 class="ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]   text-lg mb-4">
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
              <h4 class="ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]  ">{{ consultant.type }}</h4>
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
            <div class="ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]   mb-2 text-[#19213D]">Evo</div>
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
            <div class="ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]   mb-2 text-[#19213D]">
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
        class="px-4 py-3 border border-[#EAECF0] text-sm rounded-full w-fit  flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

<!--  -->

// // import {
// // Component,
// // EventEmitter,
// // Input,
// // OnInit,
// // Output,
// // HostListener,
// // } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import {
// // AgentsService,
// // AgentFilterParams,
// // } from '../../../../services/agents.service';
// // import { FormsModule } from '@angular/forms';
// // import { Consultant } from '../../../../models/consultant';
// // import { ApiResponseMeta } from '../../../../models/api-response-meta';

// // @Component({
// // selector: 'app-consulting-suggestion',
// // standalone: true,
// // imports: [CommonModule, FormsModule],
// // templateUrl: './consulting-suggestion.component.html',
// // styleUrl: './consulting-suggestion.component.scss',
// // })
// // export class ConsultingSuggestionComponent implements OnInit {
// // @Input() suggestedAgents: any[] = [];
// // @Output() continue = new EventEmitter<void>();
// // @Output() previous = new EventEmitter<void>();
// // @Output() selectedConsultantsChange = new EventEmitter<Consultant[]>();
// // @Input() selectionMap: Map<string, boolean> = new Map();
// // @Input() selectedConsultants: Consultant[] = [];

// // readonly maxSelectedConsultants = 3;

// // suggestedConsultants: Consultant[] = [];
// // filteredAgents: Consultant[] = []; // Use this as the single source of truth for displayed consultants

// // // Pagination
// // currentPage = 1;
// // itemsPerPage = 6;
// // totalItems = 0;
// // totalPages = 0;

// // // UI states
// // isLoading = false;
// // error: string | null = null;
// // activeFilter: 'all' | 'byme' | 'consultitude' = 'all';
// // searchTerm: string = '';
// // showFilterDropdown = false;

// // // Consultant selector modal
// // showConsultantSelector = false;
// // currentSlotIndex: number | null = null;
// // selectorSearchTerm: string = '';
// // filteredSelectorConsultants: Consultant[] = [];

// // // New properties for modal filter and pagination
// // selectorCurrentPage = 1;
// // selectorTotalPages = 0;
// // selectorTotalItems = 0;
// // selectorItemsPerPage = 6;
// // selectorIsLoading = false;
// // selectorError: string | null = null;
// // selectorActiveFilter: 'all' | 'byme' | 'consultitude' = 'all';
// // showSelectorFilterDropdown = false;

// // constructor(private agentService: AgentsService) {}

// // ngOnInit() {
// // this.initializeSuggestedConsultants();
// // this.fetchConsultants();
// // }

// // private initializeSuggestedConsultants() {
// // if (this.suggestedAgents && this.suggestedAgents.length > 0) {
// // this.suggestedConsultants = this.suggestedAgents.map((agent, index) => {
// // const consultant = {
// // id: index + 1,
// // type: agent.name || 'Consultant',
// // description: agent.persona,
// // creator: {
// // name: agent.name || 'Consultitude',
// // avatar: 'images/new/circle.svg',
// // },
// // likes: 1,
// // icon: this.getIconForIndex(index),
// // selected: false, // Default to false
// // profileId: agent.profileId,
// // agentId: agent.agentId,
// // };

// // // Check if the consultant is in the selectedConsultants list
// // const isSelected = this.selectedConsultants.some(
// // (selected) => selected.agentId === consultant.agentId
// // );
// // consultant.selected = isSelected;

// // return consultant;
// // });
// // }
// // }

// // fetchConsultants() {
// // this.isLoading = true;
// // this.error = null;

// // const params: AgentFilterParams = {
// // page: this.currentPage,
// // limit: this.itemsPerPage,
// // search: this.searchTerm || undefined,
// // };

// // // Add filter based on activeFilter
// // if (this.activeFilter === 'byme') {
// // params.profileId = localStorage.getItem('profileId') || '';
// // } else if (this.activeFilter === 'consultitude') {
// // params.type = ['EVO_USER'];
// // }

// // this.agentService.getAllAgents(params).subscribe({
// // next: (response: any) => {
// // if (response.success && Array.isArray(response.data)) {
// // this.filteredAgents = response.data.map(
// // (agent: any, index: number) => {
// // const consultant = {
// // id:
// // (response.meta.currentPage - 1) \* response.meta.itemsPerPage +
// // index +
// // 1,
// // type: agent.name || 'Consultant',
// // description: agent.persona,
// // creator: {
// // name: agent.owner || 'Unknown',
// // avatar: 'images/new/circle.svg',
// // },
// // likes: agent.usage || 0,
// // icon: this.getIconForIndex(index),
// // selected: false,
// // profileId: agent.profileId,
// // agentId: agent.id,
// // };

// // // Check if we have a stored selection state for this consultant
// // const key = consultant.agentId || consultant.id.toString();
// // if (this.selectionMap.has(key)) {
// // consultant.selected = this.selectionMap.get(key)!;
// // }

// // return consultant;
// // }
// // );

// // // Update pagination data from meta
// // if (response.meta) {
// // const meta: ApiResponseMeta = response.meta;
// // this.totalItems = meta.totalItems;
// // this.itemsPerPage = meta.itemsPerPage;
// // this.currentPage = meta.currentPage;
// // this.totalPages = meta.totalPages;
// // }
// // } else {
// // this.error = 'Invalid response format from server';
// // }
// // this.isLoading = false;
// // },
// // error: (err) => {
// // console.error('Error fetching agents:', err);
// // this.error = 'Failed to load consultants';
// // this.isLoading = false;
// // },
// // });
// // }

// // // New method for fetching consultants in the modal
// // fetchSelectorConsultants() {
// // this.selectorIsLoading = true;
// // this.selectorError = null;

// // const params: AgentFilterParams = {
// // page: this.selectorCurrentPage,
// // limit: this.selectorItemsPerPage,
// // search: this.selectorSearchTerm || undefined,
// // };

// // // Add filter based on activeFilter
// // if (this.selectorActiveFilter === 'byme') {
// // params.profileId = localStorage.getItem('profileId') || '';
// // } else if (this.selectorActiveFilter === 'consultitude') {
// // params.type = ['EVO_USER'];
// // }

// // this.agentService.getAllAgents(params).subscribe({
// // next: (response: any) => {
// // if (response.success && Array.isArray(response.data)) {
// // this.filteredSelectorConsultants = response.data.map(
// // (agent: any, index: number) => {
// // const consultant = {
// // id:
// // (response.meta.currentPage - 1) \* response.meta.itemsPerPage +
// // index +
// // 1,
// // type: agent.name || 'Consultant',
// // description: agent.persona,
// // creator: {
// // name: agent.owner || 'Unknown',
// // avatar: 'images/new/circle.svg',
// // },
// // likes: agent.usage || 0,
// // icon: this.getIconForIndex(index),
// // selected: false,
// // profileId: agent.profileId,
// // agentId: agent.id,
// // };

// // // Check if we have a stored selection state for this consultant
// // const key = consultant.agentId || consultant.id.toString();
// // if (this.selectionMap.has(key)) {
// // consultant.selected = this.selectionMap.get(key)!;
// // }

// // return consultant;
// // }
// // );

// // // Update pagination data from meta
// // if (response.meta) {
// // const meta: ApiResponseMeta = response.meta;
// // this.selectorTotalItems = meta.totalItems;
// // this.selectorItemsPerPage = meta.itemsPerPage;
// // this.selectorCurrentPage = meta.currentPage;
// // this.selectorTotalPages = meta.totalPages;
// // }
// // } else {
// // this.selectorError = 'Invalid response format from server';
// // }
// // this.selectorIsLoading = false;
// // },
// // error: (err) => {
// // console.error('Error fetching agents for selector:', err);
// // this.selectorError = 'Failed to load consultants';
// // this.selectorIsLoading = false;
// // },
// // });
// // }

// // private getIconForIndex(index: number): string {
// // const icons = [
// // 'pi-comments',
// // 'pi-user',
// // 'pi-clock',
// // 'pi-inbox',
// // 'pi-users',
// // 'pi-chart-bar',
// // ];
// // return icons[index % icons.length];
// // }

// // // Filter and search methods
// // searchAgents() {
// // this.currentPage = 1; // Reset to first page when searching
// // this.fetchConsultants();
// // }

// // filterAgents(filter: 'all' | 'byme' | 'consultitude') {
// // this.activeFilter = filter;
// // this.currentPage = 1; // Reset to first page when filtering
// // this.fetchConsultants();
// // }

// // toggleFilterDropdown() {
// // this.showFilterDropdown = !this.showFilterDropdown;
// // }

// // getActiveFilterLabel(): string {
// // switch (this.activeFilter) {
// // case 'all':
// // return 'All';
// // case 'byme':
// // return 'By me';
// // case 'consultitude':
// // return 'Consultitude';
// // default:
// // return 'All';
// // }
// // }

// // // New methods for modal filter and search
// // searchSelectorConsultants() {
// // this.selectorCurrentPage = 1; // Reset to first page when searching
// // this.fetchSelectorConsultants();
// // }

// // filterSelectorAgents(filter: 'all' | 'byme' | 'consultitude') {
// // this.selectorActiveFilter = filter;
// // this.selectorCurrentPage = 1; // Reset to first page when filtering
// // this.fetchSelectorConsultants();
// // }

// // toggleSelectorFilterDropdown() {
// // this.showSelectorFilterDropdown = !this.showSelectorFilterDropdown;
// // }

// // getSelectorActiveFilterLabel(): string {
// // switch (this.selectorActiveFilter) {
// // case 'all':
// // return 'All';
// // case 'byme':
// // return 'By me';
// // case 'consultitude':
// // return 'Consultitude';
// // default:
// // return 'All';
// // }
// // }

// // // Selection methods
// // toggleSuggestedSelection(consultant: Consultant) {
// // consultant.selected = !consultant.selected;
// // this.updateSelectionMap(consultant);
// // this.selectedConsultantsChange.emit(this.allSelectedConsultants);
// // }

// // toggleOtherSelection(consultant: Consultant) {
// // // Enforce maximum selection limit
// // if (
// // !consultant.selected &&
// // this.selectedConsultantsCount >= this.maxSelectedConsultants
// // ) {
// // return; // Prevent selection if already at max
// // }
// // consultant.selected = !consultant.selected;
// // this.updateSelectionMap(consultant);
// // this.selectedConsultantsChange.emit(this.allSelectedConsultants);
// // }

// // private updateSelectionMap(consultant: Consultant) {
// // const key = consultant.agentId || consultant.id.toString();
// // this.selectionMap.set(key, consultant.selected || false);
// // }

// // // Pagination methods
// // nextPage() {
// // if (this.currentPage < this.totalPages) {
// // this.currentPage++;
// // this.fetchConsultants();
// // }
// // }

// // previousPage() {
// // if (this.currentPage > 1) {
// // this.currentPage--;
// // this.fetchConsultants();
// // }
// // }

// // // New pagination methods for modal
// // nextSelectorPage() {
// // if (this.selectorCurrentPage < this.selectorTotalPages) {
// // this.selectorCurrentPage++;
// // this.fetchSelectorConsultants();
// // }
// // }

// // previousSelectorPage() {
// // if (this.selectorCurrentPage > 1) {
// // this.selectorCurrentPage--;
// // this.fetchSelectorConsultants();
// // }
// // }

// // // Navigation methods
// // goToPreviousStep() {
// // this.previous.emit();
// // }

// // continueToNextStep() {
// // this.selectedConsultantsChange.emit(this.allSelectedConsultants); // Emit only the currently selected consultants
// // this.continue.emit();
// // }

// // // Check if a consultant is already selected in any slot
// // isConsultantAlreadySelected(consultant: Consultant): boolean {
// // // Skip checking the current slot if we're replacing a slot
// // if (this.currentSlotIndex !== null) {
// // // If the current consultant in the slot is selected, we don't count it for duplicate check
// // const currentSlotConsultant =
// // this.suggestedConsultants[this.currentSlotIndex];
// // if (
// // currentSlotConsultant &&
// // currentSlotConsultant.agentId === consultant.agentId
// // ) {
// // return false;
// // }
// // }

// // // Check if this consultant is already selected in any other slot
// // const isSelectedInSuggestedSlots = this.suggestedConsultants.some(
// // (c, index) =>
// // c.agentId === consultant.agentId &&
// // c.selected &&
// // index !== this.currentSlotIndex
// // );

// // // Check if selected in other consultants list
// // const isSelectedInOtherConsultants = this.filteredAgents.some(
// // (c) => c.agentId === consultant.agentId && c.selected
// // );

// // return isSelectedInSuggestedSlots || isSelectedInOtherConsultants;
// // }

// // // Computed properties
// // get selectedConsultantsCount(): number {
// // return this.allSelectedConsultants.length;
// // }

// // get allSelectedConsultants(): Consultant[] {
// // return [
// // ...this.suggestedConsultants.filter((c) => c.selected),
// // ...this.filteredAgents.filter((c) => c.selected),
// // ];
// // }

// // // Close dropdown when clicking outside
// // @HostListener('document:click', ['$event'])
// // onDocumentClick(event: MouseEvent) {
// // // Check if the click was outside the dropdown
// // const clickedElement = event.target as HTMLElement;
// // const dropdownButton = document.querySelector('.filter-dropdown-button');
// // const dropdownContent = document.querySelector('.filter-dropdown-content');
// // const selectorDropdownButton = document.querySelector(
// // '.selector-filter-dropdown-button'
// // );
// // const selectorDropdownContent = document.querySelector(
// // '.selector-filter-dropdown-content'
// // );

// // // If we have a dropdown open and click is outside both the button and content
// // if (
// // this.showFilterDropdown &&
// // dropdownButton &&
// // dropdownContent &&
// // !dropdownButton.contains(clickedElement) &&
// // !dropdownContent.contains(clickedElement)
// // ) {
// // this.showFilterDropdown = false;
// // }

// // // Handle the selector filter dropdown
// // if (
// // this.showSelectorFilterDropdown &&
// // selectorDropdownButton &&
// // selectorDropdownContent &&
// // !selectorDropdownButton.contains(clickedElement) &&
// // !selectorDropdownContent.contains(clickedElement)
// // ) {
// // this.showSelectorFilterDropdown = false;
// // }
// // }

// // // Methods for consultant selection modal
// // openConsultantSelector(slotIndex: number) {
// // this.currentSlotIndex = slotIndex;
// // this.selectorSearchTerm = '';
// // this.selectorActiveFilter = 'all';
// // this.selectorCurrentPage = 1;
// // this.showConsultantSelector = true;
// // this.fetchSelectorConsultants(); // Fetch consultants when opening the modal
// // }

// // closeConsultantSelector() {
// // this.showConsultantSelector = false;
// // this.currentSlotIndex = null;
// // }

// // selectConsultantForSlot(consultant: Consultant) {
// // if (this.currentSlotIndex === null) return;

// // // Check if the consultant is already selected elsewhere
// // if (this.isConsultantAlreadySelected(consultant)) {
// // return; // Exit without selecting if already selected elsewhere
// // }

// // // First, check if consultant is already selected
// // if (consultant.selected) {
// // // If it's already selected, deselect it from where it is
// // consultant.selected = false;
// // this.updateSelectionMap(consultant);
// // }

// // // Then update the suggested consultant in the slot
// // const slotConsultant = this.suggestedConsultants[this.currentSlotIndex];

// // // If there was a consultant in this slot, deselect it
// // if (slotConsultant.selected) {
// // slotConsultant.selected = false;
// // this.updateSelectionMap(slotConsultant);
// // }

// // // Create a new consultant for the slot with the selected consultant's data
// // this.suggestedConsultants[this.currentSlotIndex] = {
// // ...consultant,
// // selected: true,
// // id: slotConsultant.id, // Keep the UI ID for the slot
// // // But we preserve the original agentId and profileId
// // };

// // this.updateSelectionMap(this.suggestedConsultants[this.currentSlotIndex]);
// // this.selectedConsultantsChange.emit(this.allSelectedConsultants);
// // this.closeConsultantSelector();
// // }
// // }

// // consulting-suggestion.component.ts
// // consulting-suggestion.component.ts
// import {
// Component,
// EventEmitter,
// Input,
// OnInit,
// Output,
// HostListener,
// OnChanges,
// SimpleChanges,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
// AgentsService,
// AgentFilterParams,
// } from '../../../../services/agents.service';
// import { FormsModule } from '@angular/forms';
// import { Consultant } from '../../../../models/consultant';
// import { ApiResponseMeta } from '../../../../models/api-response-meta';

// @Component({
// selector: 'app-consulting-suggestion',
// standalone: true,
// imports: [CommonModule, FormsModule],
// templateUrl: './consulting-suggestion.component.html',
// styleUrl: './consulting-suggestion.component.scss',
// })
// export class ConsultingSuggestionComponent implements OnInit, OnChanges {
// @Input() suggestedAgents: any[] = [];
// @Output() continue = new EventEmitter<void>();
// @Output() previous = new EventEmitter<void>();
// @Output() selectedConsultantsChange = new EventEmitter<Consultant[]>();
// @Input() selectionMap: Map<string, boolean> = new Map();
// @Input() selectedConsultants: Consultant[] = [];

// readonly maxSelectedConsultants = 3;

// suggestedConsultants: Consultant[] = [];
// filteredAgents: Consultant[] = []; // Use this as the single source of truth for displayed consultants

// // Track if component has been initialized
// private initialized = false;

// // Store the IDs of consultants that were originally suggested
// private originalSuggestedAgentIds: string[] = [];

// // Pagination
// currentPage = 1;
// itemsPerPage = 6;
// totalItems = 0;
// totalPages = 0;

// // UI states
// isLoading = false;
// error: string | null = null;
// activeFilter: 'all' | 'byme' | 'consultitude' = 'all';
// searchTerm: string = '';
// showFilterDropdown = false;

// // Consultant selector modal
// showConsultantSelector = false;
// currentSlotIndex: number | null = null;
// selectorSearchTerm: string = '';
// filteredSelectorConsultants: Consultant[] = [];

// // New properties for modal filter and pagination
// selectorCurrentPage = 1;
// selectorTotalPages = 0;
// selectorTotalItems = 0;
// selectorItemsPerPage = 6;
// selectorIsLoading = false;
// selectorError: string | null = null;
// selectorActiveFilter: 'all' | 'byme' | 'consultitude' = 'all';
// showSelectorFilterDropdown = false;

// constructor(private agentService: AgentsService) {}

// ngOnInit() {
// this.initialized = true;

// // Log the structure of suggestedAgents for debugging
// if (this.suggestedAgents && this.suggestedAgents.length > 0) {
// console.log(
// 'Suggested agents structure:',
// JSON.stringify(this.suggestedAgents[0], null, 2)
// );
// } else {
// console.log('No suggested agents available');
// }

// // Force the call to be deferred to ensure all inputs are initialized
// this.initializeSuggestedConsultants();
// this.fetchConsultants();
// }

// ngOnChanges(changes: SimpleChanges) {
// // Only process changes after component has been initialized
// if (!this.initialized) return;

// if (changes['selectedConsultants']) {
// // When selectedConsultants changes, correctly distribute them across the UI
// this.redistributeConsultants();
// }
// }

// private redistributeConsultants() {
// // Update the suggestedConsultants array to match the current selected consultants
// this.updateSuggestedConsultantsFromSelection();

// // Update the filteredAgents to exclude the selected consultants
// this.updateFilteredAgentsFromSelection();
// }

// private updateSuggestedConsultantsFromSelection() {
// // Ensure we have enough slots (should be 3 slots)
// if (this.suggestedConsultants.length < this.maxSelectedConsultants) {
// // Add empty slots if needed
// const slotsToAdd =
// this.maxSelectedConsultants - this.suggestedConsultants.length;
// for (let i = 0; i < slotsToAdd; i++) {
// this.suggestedConsultants.push({
// id: this.suggestedConsultants.length + 1,
// type: 'Consultant',
// description: '',
// creator: {
// name: 'Consultitude',
// avatar: 'images/new/circle.svg',
// },
// likes: 1,
// icon: this.getIconForIndex(this.suggestedConsultants.length),
// selected: false,
// profileId: '',
// agentId: '',
// });
// }
// }

// // First, reset all slots to unselected
// this.suggestedConsultants.forEach((consultant) => {
// consultant.selected = false;
// });

// // Then place the selected consultants in the slots
// this.selectedConsultants.forEach((selectedConsultant, index) => {
// if (index < this.maxSelectedConsultants) {
// // Ensure the consultant has all required properties with defaults
// const validConsultant = {
// ...selectedConsultant,
// type: selectedConsultant.type || 'Consultant',
// description: selectedConsultant.description || '',
// creator: {
// name:
// (selectedConsultant.creator && selectedConsultant.creator.name) ||
// 'Consultitude',
// avatar:
// (selectedConsultant.creator &&
// selectedConsultant.creator.avatar) ||
// 'images/new/circle.svg',
// },
// likes: selectedConsultant.likes || 1,
// icon: selectedConsultant.icon || this.getIconForIndex(index),
// profileId: selectedConsultant.profileId || '',
// agentId: selectedConsultant.agentId || '',
// };

// // Copy data to the slot, maintaining the slot's ID
// const slotId = this.suggestedConsultants[index].id;
// this.suggestedConsultants[index] = {
// ...validConsultant,
// id: slotId,
// selected: true,
// };
// }
// });
// }

// private updateFilteredAgentsFromSelection() {
// // Mark consultants in filteredAgents as selected/unselected based on their presence in selectedConsultants
// this.filteredAgents.forEach((agent) => {
// agent.selected = this.selectedConsultants.some(
// (selected) => selected.agentId === agent.agentId
// );
// });
// }

// private initializeSuggestedConsultants() {
// if (this.suggestedAgents && this.suggestedAgents.length > 0) {
// this.suggestedConsultants = this.suggestedAgents.map((agent, index) => {
// const consultant = {
// id: index + 1,
// type: agent.name || 'Consultant',
// description: agent.persona,
// creator: {
// name: agent.name || 'Consultitude',
// avatar: 'images/new/circle.svg',
// },
// likes: 1,
// icon: this.getIconForIndex(index),
// selected: false, // Default to false
// profileId: agent.profileId,
// agentId: agent.agentId,
// };

// // Check if the consultant is in the selectedConsultants list
// const isSelected = this.selectedConsultants.some(
// (selected) => selected.agentId === consultant.agentId
// );
// consultant.selected = isSelected;

// return consultant;
// });
// }
// }

// fetchConsultants() {
// this.isLoading = true;
// this.error = null;

// const params: AgentFilterParams = {
// page: this.currentPage,
// limit: this.itemsPerPage,
// search: this.searchTerm || undefined,
// };

// // Add filter based on activeFilter
// if (this.activeFilter === 'byme') {
// params.profileId = localStorage.getItem('profileId') || '';
// } else if (this.activeFilter === 'consultitude') {
// params.type = ['EVO_USER'];
// }

// this.agentService.getAllAgents(params).subscribe({
// next: (response: any) => {
// if (response.success && Array.isArray(response.data)) {
// this.filteredAgents = response.data.map(
// (agent: any, index: number) => {
// const consultant = {
// id:
// (response.meta.currentPage - 1) \* response.meta.itemsPerPage +
// index +
// 1,
// type: agent.name || 'Consultant',
// description: agent.persona || '',
// creator: {
// name: agent.owner || 'Unknown',
// avatar: 'images/new/circle.svg',
// },
// likes: agent.usage || 0,
// icon: this.getIconForIndex(index),
// selected: false,
// profileId: agent.profileId || '',
// agentId: agent.id || '',
// };

// // Check if we have a stored selection state for this consultant
// const key = consultant.agentId || consultant.id.toString();
// if (this.selectionMap.has(key)) {
// consultant.selected = this.selectionMap.get(key)!;
// }

// // Check if this consultant is already in the selectedConsultants list
// if (
// this.selectedConsultants.some(
// (selected) => selected.agentId === consultant.agentId
// )
// ) {
// consultant.selected = true;
// }

// return consultant;
// }
// );

// // Update pagination data from meta
// if (response.meta) {
// const meta: ApiResponseMeta = response.meta;
// this.totalItems = meta.totalItems || 0;
// this.itemsPerPage = meta.itemsPerPage || 10;
// this.currentPage = meta.currentPage || 1;
// this.totalPages = meta.totalPages || 1;
// }
// } else {
// this.error = 'Invalid response format from server';
// }
// this.isLoading = false;
// },
// error: (err) => {
// console.error('Error fetching agents:', err);
// this.error = 'Failed to load consultants';
// this.isLoading = false;
// },
// });
// }

// // New method for fetching consultants in the modal
// fetchSelectorConsultants() {
// this.selectorIsLoading = true;
// this.selectorError = null;

// const params: AgentFilterParams = {
// page: this.selectorCurrentPage,
// limit: this.selectorItemsPerPage,
// search: this.selectorSearchTerm || undefined,
// };

// // Add filter based on activeFilter
// if (this.selectorActiveFilter === 'byme') {
// params.profileId = localStorage.getItem('profileId') || '';
// } else if (this.selectorActiveFilter === 'consultitude') {
// params.type = ['EVO_USER'];
// }

// this.agentService.getAllAgents(params).subscribe({
// next: (response: any) => {
// if (response.success && Array.isArray(response.data)) {
// this.filteredSelectorConsultants = response.data.map(
// (agent: any, index: number) => {
// const consultant = {
// id:
// (response.meta.currentPage - 1) \* response.meta.itemsPerPage +
// index +
// 1,
// type: agent.name || 'Consultant',
// description: agent.persona || '',
// creator: {
// name: agent.owner || 'Unknown',
// avatar: 'images/new/circle.svg',
// },
// likes: agent.usage || 0,
// icon: this.getIconForIndex(index),
// selected: false,
// profileId: agent.profileId || '',
// agentId: agent.id || '',
// };

// // Check if this consultant is already in the selectedConsultants list
// if (
// this.selectedConsultants.some(
// (selected) => selected.agentId === consultant.agentId
// )
// ) {
// consultant.selected = true;
// }

// return consultant;
// }
// );

// // Update pagination data from meta
// if (response.meta) {
// const meta: ApiResponseMeta = response.meta;
// this.selectorTotalItems = meta.totalItems || 0;
// this.selectorItemsPerPage = meta.itemsPerPage || 10;
// this.selectorCurrentPage = meta.currentPage || 1;
// this.selectorTotalPages = meta.totalPages || 1;
// }
// } else {
// this.selectorError = 'Invalid response format from server';
// }
// this.selectorIsLoading = false;
// },
// error: (err) => {
// console.error('Error fetching agents for selector:', err);
// this.selectorError = 'Failed to load consultants';
// this.selectorIsLoading = false;
// },
// });
// }

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

// // Filter and search methods
// searchAgents() {
// this.currentPage = 1; // Reset to first page when searching
// this.fetchConsultants();
// }

// filterAgents(filter: 'all' | 'byme' | 'consultitude') {
// this.activeFilter = filter;
// this.currentPage = 1; // Reset to first page when filtering
// this.fetchConsultants();
// }

// toggleFilterDropdown() {
// this.showFilterDropdown = !this.showFilterDropdown;
// }

// getActiveFilterLabel(): string {
// switch (this.activeFilter) {
// case 'all':
// return 'All';
// case 'byme':
// return 'By me';
// case 'consultitude':
// return 'Consultitude';
// default:
// return 'All';
// }
// }

// // New methods for modal filter and search
// searchSelectorConsultants() {
// this.selectorCurrentPage = 1; // Reset to first page when searching
// this.fetchSelectorConsultants();
// }

// filterSelectorAgents(filter: 'all' | 'byme' | 'consultitude') {
// this.selectorActiveFilter = filter;
// this.selectorCurrentPage = 1; // Reset to first page when filtering
// this.fetchSelectorConsultants();
// }

// toggleSelectorFilterDropdown() {
// this.showSelectorFilterDropdown = !this.showSelectorFilterDropdown;
// }

// getSelectorActiveFilterLabel(): string {
// switch (this.selectorActiveFilter) {
// case 'all':
// return 'All';
// case 'byme':
// return 'By me';
// case 'consultitude':
// return 'Consultitude';
// default:
// return 'All';
// }
// }

// // Selection methods
// toggleSuggestedSelection(consultant: Consultant) {
// const wasSelected = consultant.selected;
// consultant.selected = !consultant.selected;
// this.updateSelectionMap(consultant);

// // If this consultant was deselected, we need to update the other lists
// if (wasSelected) {
// // Find the corresponding consultant in filteredAgents and deselect it
// const matchingConsultant = this.filteredAgents.find(
// (c) => c.agentId === consultant.agentId
// );
// if (matchingConsultant) {
// matchingConsultant.selected = false;
// this.updateSelectionMap(matchingConsultant);
// }
// }

// this.updateSelectedConsultantsList();
// }

// toggleOtherSelection(consultant: Consultant) {
// // Enforce maximum selection limit
// if (
// !consultant.selected &&
// this.selectedConsultantsCount >= this.maxSelectedConsultants
// ) {
// return; // Prevent selection if already at max
// }

// const wasSelected = consultant.selected;
// consultant.selected = !consultant.selected;
// this.updateSelectionMap(consultant);

// if (consultant.selected) {
// // Find an empty slot to place this consultant in
// const emptySlotIndex = this.suggestedConsultants.findIndex(
// (c) => !c.selected
// );
// if (emptySlotIndex !== -1) {
// // Create a copy of the consultant for the slot
// const slotConsultant = {
// ...consultant,
// id: this.suggestedConsultants[emptySlotIndex].id,
// };
// this.suggestedConsultants[emptySlotIndex] = slotConsultant;
// }
// } else {
// // If deselected, find and clear the consultant from the suggested slots
// const slotIndex = this.suggestedConsultants.findIndex(
// (c) => c.agentId === consultant.agentId
// );
// if (slotIndex !== -1) {
// this.suggestedConsultants[slotIndex].selected = false;
// }
// }

// this.updateSelectedConsultantsList();
// }

// private updateSelectionMap(consultant: Consultant) {
// const key = consultant.agentId || consultant.id.toString();
// this.selectionMap.set(key, consultant.selected || false);
// }

// private updateSelectedConsultantsList() {
// // Get all selected consultants from both the suggested slots and filtered list
// const selectedConsultants = [
// ...this.suggestedConsultants.filter((c) => c.selected),
// ...this.filteredAgents.filter(
// (c) =>
// c.selected &&
// !this.suggestedConsultants.some((sc) => sc.agentId === c.agentId)
// ),
// ];

// this.selectedConsultantsChange.emit(selectedConsultants);
// }

// // Pagination methods
// nextPage() {
// if (this.currentPage < this.totalPages) {
// this.currentPage++;
// this.fetchConsultants();
// }
// }

// previousPage() {
// if (this.currentPage > 1) {
// this.currentPage--;
// this.fetchConsultants();
// }
// }

// // New pagination methods for modal
// nextSelectorPage() {
// if (this.selectorCurrentPage < this.selectorTotalPages) {
// this.selectorCurrentPage++;
// this.fetchSelectorConsultants();
// }
// }

// previousSelectorPage() {
// if (this.selectorCurrentPage > 1) {
// this.selectorCurrentPage--;
// this.fetchSelectorConsultants();
// }
// }

// // Navigation methods
// goToPreviousStep() {
// this.previous.emit();
// }

// continueToNextStep() {
// this.selectedConsultantsChange.emit(this.allSelectedConsultants); // Emit only the currently selected consultants
// this.continue.emit();
// }

// // Check if a consultant is already selected in any slot
// isConsultantAlreadySelected(consultant: Consultant): boolean {
// // Skip checking the current slot if we're replacing a slot
// if (this.currentSlotIndex !== null) {
// // If the current consultant in the slot is selected, we don't count it for duplicate check
// const currentSlotConsultant =
// this.suggestedConsultants[this.currentSlotIndex];
// if (
// currentSlotConsultant &&
// currentSlotConsultant.agentId === consultant.agentId
// ) {
// return false;
// }
// }

// // Check if this consultant is already selected in any other slot
// const isSelectedInSuggestedSlots = this.suggestedConsultants.some(
// (c, index) =>
// c.agentId === consultant.agentId &&
// c.selected &&
// index !== this.currentSlotIndex
// );

// // Check if selected in other consultants list
// const isSelectedInOtherConsultants = this.filteredAgents.some(
// (c) => c.agentId === consultant.agentId && c.selected
// );

// return isSelectedInSuggestedSlots || isSelectedInOtherConsultants;
// }

// // Computed properties
// get selectedConsultantsCount(): number {
// return this.allSelectedConsultants.length;
// }

// get allSelectedConsultants(): Consultant[] {
// // Get unique selected consultants from both lists
// const selectedFromSuggested = this.suggestedConsultants.filter(
// (c) => c.selected
// );
// const selectedIds = new Set(selectedFromSuggested.map((c) => c.agentId));

// // Add selected from filtered list only if not already in suggested
// const selectedFromFiltered = this.filteredAgents.filter(
// (c) => c.selected && !selectedIds.has(c.agentId)
// );

// return [...selectedFromSuggested, ...selectedFromFiltered];
// }

// // Close dropdown when clicking outside
// @HostListener('document:click', ['$event'])
// onDocumentClick(event: MouseEvent) {
// // Check if the click was outside the dropdown
// const clickedElement = event.target as HTMLElement;
// const dropdownButton = document.querySelector('.filter-dropdown-button');
// const dropdownContent = document.querySelector('.filter-dropdown-content');
// const selectorDropdownButton = document.querySelector(
// '.selector-filter-dropdown-button'
// );
// const selectorDropdownContent = document.querySelector(
// '.selector-filter-dropdown-content'
// );

// // If we have a dropdown open and click is outside both the button and content
// if (
// this.showFilterDropdown &&
// dropdownButton &&
// dropdownContent &&
// !dropdownButton.contains(clickedElement) &&
// !dropdownContent.contains(clickedElement)
// ) {
// this.showFilterDropdown = false;
// }

// // Handle the selector filter dropdown
// if (
// this.showSelectorFilterDropdown &&
// selectorDropdownButton &&
// selectorDropdownContent &&
// !selectorDropdownButton.contains(clickedElement) &&
// !selectorDropdownContent.contains(clickedElement)
// ) {
// this.showSelectorFilterDropdown = false;
// }
// }

// // Methods for consultant selection modal
// openConsultantSelector(slotIndex: number) {
// this.currentSlotIndex = slotIndex;
// this.selectorSearchTerm = '';
// this.selectorActiveFilter = 'all';
// this.selectorCurrentPage = 1;
// this.showConsultantSelector = true;
// this.fetchSelectorConsultants(); // Fetch consultants when opening the modal
// }

// closeConsultantSelector() {
// this.showConsultantSelector = false;
// this.currentSlotIndex = null;
// }

// selectConsultantForSlot(consultant: Consultant) {
// if (this.currentSlotIndex === null) return;

// // Check if the consultant is already selected elsewhere
// if (this.isConsultantAlreadySelected(consultant)) {
// return; // Exit without selecting if already selected elsewhere
// }

// // Clear any previous consultant in this slot
// const previousConsultant = this.suggestedConsultants[this.currentSlotIndex];
// if (previousConsultant.selected) {
// // Update the corresponding entry in filteredAgents if it exists
// const matchingConsultant = this.filteredAgents.find(
// (c) => c.agentId === previousConsultant.agentId
// );
// if (matchingConsultant) {
// matchingConsultant.selected = false;
// this.updateSelectionMap(matchingConsultant);
// }
// }

// // Mark the new consultant as selected in the filteredAgents list
// const matchingConsultant = this.filteredAgents.find(
// (c) => c.agentId === consultant.agentId
// );
// if (matchingConsultant) {
// matchingConsultant.selected = true;
// this.updateSelectionMap(matchingConsultant);
// }

// // Ensure consultant has all required properties with defaults
// const validConsultant = {
// ...consultant,
// type: consultant.type || 'Consultant',
// description: consultant.description || '',
// creator: {
// name: (consultant.creator && consultant.creator.name) || 'Consultitude',
// avatar:
// (consultant.creator && consultant.creator.avatar) ||
// 'images/new/circle.svg',
// },
// likes: consultant.likes || 1,
// icon: consultant.icon || this.getIconForIndex(this.currentSlotIndex),
// profileId: consultant.profileId || '',
// agentId: consultant.agentId || '',
// };

// // Create a new consultant for the slot with the selected consultant's data
// this.suggestedConsultants[this.currentSlotIndex] = {
// ...validConsultant,
// selected: true,
// id: previousConsultant.id, // Keep the UI ID for the slot
// };

// this.updateSelectionMap(this.suggestedConsultants[this.currentSlotIndex]);
// this.updateSelectedConsultantsList();
// this.closeConsultantSelector();
// }
// }

input document == name of the file

ipad:font-[500] bigger:font-[500] big:text-[16] bigger:text-[17px]

<!--  -->

1- design the history chats
2- tooltip
2- hide the selected active from the other consulats ()
