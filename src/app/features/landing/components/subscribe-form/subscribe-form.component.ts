import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SubscribeService } from '../../services/subscribe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscribe-form',
  templateUrl: './subscribe-form.component.html',
  styleUrl: './subscribe-form.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class SubscribeFormComponent implements OnInit {
  @Output() errorOccurred = new EventEmitter<string>(); // Emit errors to parent
  loading = false;
  showEmailError = false;
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
    // Reset error visibility
    this.showEmailError = false;

    // Mark the form as touched to trigger validation
    this.subscribeForm.markAllAsTouched();

    // Check if the form is valid
    if (this.subscribeForm.invalid) {
      // Show errors if form is invalid
      this.showEmailError = true;
      setTimeout(() => {
        this.showEmailError = false;
      }, 3000);
      if (this.subscribeForm.value === '') {
        this.showEmailError = false;
      }
      return;
    }

    // If form is valid, proceed with submission
    this.loading = true;
    this.subscribeService.subscribe(this.subscribeForm.value.email).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.router.navigate(['/successfully_subscribed']);
      },
      error: (err: HttpErrorResponse) => {
        if (err.error) {
          this.router.navigate(['/subscribed']);
        }
        this.loading = false;
        // this.errorOccurred.emit(err.error.message); // Emit error
      },
    });
  }
}
