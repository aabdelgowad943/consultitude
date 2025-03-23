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

  // Flags for different sections
  summarySection: boolean = true;
  conversationStarted: boolean = false;
  showFinalReport: boolean = false;

  // Timestamps
  summaryTimestamp: Date = new Date();
  reportTimestamp: Date = new Date();

  // Content
  chatMessages: ChatMessage[] = [];
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

  // Generated content
  get consultantsNames(): string {
    return this.consultants.map((c) => c.name).join(', ');
  }

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
              consultantInfo: this.consultants[0],
              text: this.consultants[0].description,
              timestamp: new Date(),
            },
            () => {
              // Delta consultant response
              setTimeout(() => {
                this.addMessageWithTypingEffect(
                  {
                    sender: 'consultant',
                    consultantInfo: this.consultants[1],
                    text: this.consultants[1].description,
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
                                consultantInfo: this.consultants[1],
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
    { text: 'Summarize into a document & download?', icon: 'pi pi-download' },
    {
      text: 'Drafting a proposal/presentation?',
      soon: 'coming soon',
      icon: 'pi pi-file',
    },
  ];
}
