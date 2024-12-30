import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubscribeService } from '../../services/subscribe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscribe-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './subscribe-form.component.html',
  styleUrl: './subscribe-form.component.scss',
})
export class SubscribeFormComponent implements OnInit {
  subscribeForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private subscribeService: SubscribeService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.subscribeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    this.subscribeService.subscribe(this.subscribeForm.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['/successfully_subscribed']);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error);
      },
    });
  }
}
