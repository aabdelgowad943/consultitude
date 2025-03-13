import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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

@Component({
  selector: 'app-contact-us',
  imports: [
    FooterComponent,
    NavbarComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent implements OnInit, OnChanges {
  userId: string = localStorage.getItem('userId')!;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';

  contactForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private contactService: ContactUsService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.getUserData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['userId'].currentValue !== changes['userId'].previousValue &&
      changes['userId'].currentValue !== null
    ) {
      this.getUserData();
    }
  }
  getUserData() {
    this.authService.getUserDataByUserId(this.userId).subscribe({
      next: (res: any) => {
        this.firstName = res.data.firstName;
        this.lastName = res.data.lastName;
        this.email = res.data.user.email;
        this.phone = res.data.phone;
      },
    });
  }

  errorMessage: string = '';
  successMessage: string = '';

  onSubmit() {
    const formValue = this.contactForm.value;
    this.contactService
      .createContactUs({
        name: this.firstName + ' ' + this.lastName,
        email: this.email,
        phone: this.phone,
        message: formValue.message,
      })
      .subscribe({
        next: (res: any) => {
          this.successMessage =
            res.message || 'Contact us successfully created ';
          // this.contactForm.reset();
          this.errorMessage = '';
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage =
            err.message || 'Failed in creation, please try again!';
          this.successMessage = '';
        },
      });
  }
}
