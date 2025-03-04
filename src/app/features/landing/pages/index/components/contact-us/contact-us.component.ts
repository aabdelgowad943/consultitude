import { Component } from '@angular/core';
import { SubscribeService } from '../../../../services/subscribe.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RequestDocument } from '../../../../models/request-document';
import { CommonModule } from '@angular/common';
import { ProductServiceService } from '../../../../../knowledge-hub/services/product-service.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-contact-us',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  requestForm!: FormGroup;
  areaOfFocusList: any[] = [];
  documentsList: any[] = [];

  successMessage: string = '';

  errorMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private subscribeService: SubscribeService,
    private productService: ProductServiceService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAreaOfFocus();
    this.loadDocuments();
  }

  initForm() {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      documentFormatId: ['', Validators.required],
      areaOfFocusId: ['', Validators.required],
      description: ['', Validators.required],
      language: ['English', Validators.required], // default value can be changed as needed
    });
  }

  loadAreaOfFocus() {
    this.productService.getAllAreaFocus().subscribe({
      next: (data) => {
        this.areaOfFocusList = data;
        console.log(data);
      },
    });
  }

  loadDocuments() {
    this.productService.getAllDocumentTypes().subscribe({
      next: (data: any) => {
        this.documentsList = data;
      },
    });
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      // Mark all fields as touched so validation errors are displayed
      this.requestForm.markAllAsTouched();
      return;
    }

    const requestDocumentPayload: RequestDocument = this.requestForm.value;

    this.subscribeService.requestDocument(requestDocumentPayload).subscribe({
      next: (res: any) => {
        this.successMessage = 'Request submitted successfully';
        // remove the message after 2 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
        this.errorMessage = '';
        this.requestForm.reset();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Error submitting';

        this.successMessage = '';
      },
    });
  }
}
