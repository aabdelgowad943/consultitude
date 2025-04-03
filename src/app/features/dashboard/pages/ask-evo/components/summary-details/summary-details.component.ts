import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatTest } from '../../../../models/chat';

interface Consultant {
  id: number;
  type: string;
  description: string;
  creator: {
    name: string;
    avatar: string | null;
    initial?: string;
  };
  likes: number;
  icon: string;
  selected?: boolean;
}

@Component({
  selector: 'app-summary-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-details.component.html',
  styleUrl: './summary-details.component.scss',
})
export class SummaryDetailsComponent implements OnInit {
  @Input() fileName: string = '';
  @Input() fileSize: string = '';
  @Input() userQuestion: string = '';
  @Input() serviceId: string = '';
  @Input() selectedConsultants: any[] = [];
  // @Input() documentUrl: string = '';
  @Input() documentUrl: any;

  @Output() continue = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() startChat = new EventEmitter<any>();

  ngOnInit(): void {
    // console.log(this.userQuestion);
    // console.log(this.serviceId);
    // console.log(this.selectedConsultants);
  }

  goToPreviousStep() {
    this.previous.emit();
  }

  continueToNextStep() {
    const chatData = {
      title: this.fileName || 'New Chat',
      serviceId: this.serviceId,
      ownerId: localStorage.getItem('profileId') || '',
      ask: this.userQuestion,
      agents: this.selectedConsultants.map((c) => c.agentId.toString()),
      documents: [this.documentUrl],
    };
    this.startChat.emit(chatData);
    this.continue.emit();
  }
  // ===============================================================
  // continueToNextStep() {
  //   const chatData: ChatTest = {
  //     agents: [
  //       {
  //         agentId: this.selectedConsultants[0]?.agentId.toString() || '',
  //         domain: this.selectedConsultants[0]?.domain || 'domain',
  //         location: this.selectedConsultants[0]?.location || 'location',
  //         name: this.selectedConsultants[0]?.name || 'name',
  //         output: this.selectedConsultants[0]?.output || 'output',
  //         persona: this.selectedConsultants[0]?.persona || 'persona',
  //       },
  //     ],
  //     docs: [this.documentUrl],
  //   };
  //   this.startChat.emit(chatData);
  //   this.continue.emit();
  // }
}
