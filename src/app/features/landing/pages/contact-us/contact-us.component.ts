import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FooterComponent } from '../../../../shared/footer/footer.component';
import { NavbarComponent } from '../../../../shared/navbar/navbar.component';
import { AuthService } from '../../../auth/services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ContactUsService } from '../../services/contact-us.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-us',
  imports: [
    FooterComponent,
    NavbarComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent implements OnInit, OnChanges, OnDestroy {
  userId: string = localStorage.getItem('userId') || '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';

  contactForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  isSubmitting: boolean = false;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private contactService: ContactUsService
  ) {
    this.initForm();
    if (this.userId) {
      this.getUserData();
    }
  }

  ngOnInit(): void {
    if (this.userId && !this.firstName) {
      this.getUserData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['userId'] &&
      changes['userId'].currentValue !== changes['userId'].previousValue &&
      changes['userId'].currentValue !== null
    ) {
      this.getUserData();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  initForm(): void {
    // New validator that rejects any string containing whitespace
    const noWhitespace = Validators.pattern(/^[^\s]+$/);

    // Alternative validator that rejects strings that are only whitespace
    // Use this for fields where spaces are allowed within the text, like names
    const notOnlyWhitespace = Validators.pattern(/^(?!\s*$).+/);

    this.contactForm = this.fb.group({
      // For name fields, we probably want to allow spaces (like "John Doe")
      name: ['', [Validators.required, notOnlyWhitespace]],
      // lastName: ['', [Validators.required, notOnlyWhitespace]],
      // Email shouldn't contain spaces
      email: ['', [Validators.required, Validators.email, noWhitespace]],
      // Phone might have spaces for formatting
      // phone: [
      //   '',
      //   [
      //     Validators.required,
      //     Validators.pattern('^\\+?[0-9]+[0-9 ]*$'),
      //     notOnlyWhitespace,
      //   ],
      // ],
      // Message can contain spaces but shouldn't be empty
      message: ['', [Validators.required, notOnlyWhitespace]],
      agree: [false, Validators.requiredTrue],
      question: ['', Validators.required], // Add question with required validator
    });
  }

  getUserData(): void {
    if (!this.userId) return;

    const subscription = this.authService
      .getUserDataByUserId(this.userId)
      .subscribe({
        next: (res: any) => {
          if (res && res.data) {
            this.firstName = res.data.firstName || '';
            this.lastName = res.data.lastName || '';
            this.email = res.data.user?.email || '';
            this.phone = res.data.phone || '';

            // Update form values after getting user data
            this.contactForm.patchValue({
              name: this.firstName + this.lastName,
              // lastName: this.lastName,
              email: this.email,
              // phone: this.phone,
            });
          }
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        },
      });

    this.subscriptions.add(subscription);
  }

  onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.contactForm.value;
    console.log(formValue);

    const subscription = this.contactService
      .createContactUs({
        name: `${formValue.name}`,
        email: formValue.email,
        phone: formValue.phone,
        message: formValue.message,
        question: formValue.question,
      })
      .subscribe({
        next: (res: any) => {
          this.successMessage =
            res.message || 'Your message has been sent successfully!';
          this.errorMessage = '';
          this.resetForm();

          // clear the success message after 3 sec
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage =
            err.error?.message ||
            'Failed to send message. Please try again later.';
          this.successMessage = '';

          // clear the error message after 3 sec
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });

    this.subscriptions.add(subscription);
  }

  resetForm(): void {
    // Reset form but keep user information
    this.contactForm.patchValue({
      message: '',
      agree: false,
    });

    // Mark only these fields as untouched/pristine
    this.contactForm.get('message')?.markAsUntouched();
    this.contactForm.get('message')?.markAsPristine();
    this.contactForm.get('agree')?.markAsUntouched();
    this.contactForm.get('agree')?.markAsPristine();
  }
}
