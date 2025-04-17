import { Component, OnInit } from '@angular/core';
import { EvoServicesService } from '../../services/evo-services.service';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from '../../../../../shared/pipes/custom-date.pipe';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

interface ChatMessage {
  agent: string;
  content: string;
  timestamp?: string;
}

interface ChatDetails {
  title: string;
  ask: string;
  updatedAt: string;
  messages: ChatMessage[];
  final_report?: string;
}

@Component({
  selector: 'app-show-chat',
  standalone: true,
  imports: [CommonModule, CustomDatePipe],
  templateUrl: './show-chat.component.html',
  styleUrl: './show-chat.component.scss',
})
export class ShowChatComponent implements OnInit {
  chatId: string = '';
  chatDetails: ChatDetails | null = null;
  isLoading: boolean = false;
  userId: string = localStorage.getItem('userId') || '';

  constructor(
    private evoService: EvoServicesService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.chatId = this.getChatIdFromUrl();
    this.getChatDetails(this.chatId);
  }

  getChatIdFromUrl(): string {
    const urlSegments = window.location.pathname.split('/');
    return urlSegments[urlSegments.length - 1];
  }

  getChatDetails(chatId: string) {
    this.isLoading = true;
    this.evoService.getChatById(chatId).subscribe({
      next: (res: any) => {
        // Sanitize HTML content to prevent XSS
        const sanitizedData: ChatDetails = {
          ...res.data,
          messages: res.data.messages.map((msg: ChatMessage) => ({
            ...msg,
            content: this.sanitizer.bypassSecurityTrustHtml(
              marked.parse(msg.content, { async: false })
            ) as string,
          })),
          final_report: this.sanitizer.bypassSecurityTrustHtml(
            marked.parse(res.data.final_report, { async: false })
          ) as string,
        };

        this.chatDetails = sanitizedData;
        this.isLoading = false;
        // console.log(this.chatDetails);
      },
      error: (err) => {
        console.error('Error fetching chat details:', err);
        this.isLoading = false;
      },
    });
  }
}
