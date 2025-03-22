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
