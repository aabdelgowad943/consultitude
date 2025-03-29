import { Component, OnInit } from '@angular/core';
import { EvoServicesService } from '../../services/evo-services.service';
import { CommonModule } from '@angular/common';
import { CustomDatePipe } from '../../../../../shared/pipes/custom-date.pipe';

@Component({
  selector: 'app-show-chat',
  imports: [CommonModule, CustomDatePipe],
  templateUrl: './show-chat.component.html',
  styleUrl: './show-chat.component.scss',
})
export class ShowChatComponent implements OnInit {
  chatId: string = '';
  chatDetails: any = null;
  isLoading: boolean = false;
  userId: string = localStorage.getItem('userId') || '';

  constructor(private evoService: EvoServicesService) {}

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
        this.chatDetails = res.data;
        this.isLoading = false;
        console.log(res.data.title);
      },
      error: (err) => {
        console.error('Error fetching chat details:', err);
        this.isLoading = false;
      },
    });
  }
}
