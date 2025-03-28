import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SseService } from '../../services/sse.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sse-test',
  imports: [CommonModule],
  templateUrl: './sse-test.component.html',
  styleUrl: './sse-test.component.scss',
})
export class SseTestComponent {
  message = '';
  private subscription!: Subscription;

  constructor(private sseService: SseService) {}

  ngOnInit() {
    this.sseService.connect();
    this.subscription = this.sseService.messages$.subscribe((msg) => {
      this.message = msg;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.sseService.disconnect();
  }
}
