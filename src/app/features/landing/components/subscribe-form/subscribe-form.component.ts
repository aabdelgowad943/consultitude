import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubscribeService } from '../../services/subscribe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-subscribe-form',
  imports: [ReactiveFormsModule, CommonModule, ToastModule],
  templateUrl: './subscribe-form.component.html',
  styleUrl: './subscribe-form.component.scss',
  providers: [MessageService],
})
export class SubscribeFormComponent implements OnInit {
  loading = false;
  subscribeForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private subscribeService: SubscribeService,
    private router: Router,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.subscribeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.loading = true;
    this.subscribeService.subscribe(this.subscribeForm.value.email).subscribe({
      next: (res: any) => {
        // console.log(res);

        this.loading = false;
        if (res) {
          this.router.navigate(['/successfully_subscribed']);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${res.message}`,
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `${err.error.message}`,
        });
      },
    });
  }
}
