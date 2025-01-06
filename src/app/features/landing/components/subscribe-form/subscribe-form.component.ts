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
  imports: [ReactiveFormsModule, CommonModule],
})
export class SubscribeFormComponent implements OnInit {
  @Output() errorOccurred = new EventEmitter<string>(); // Emit errors to parent
  loading = false;
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
    this.loading = true;
    this.subscribeService.subscribe(this.subscribeForm.value.email).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/successfully_subscribed']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.errorOccurred.emit(err.error.message); // Emit error
      },
    });
  }
}
