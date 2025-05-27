import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ProductServiceService } from '../../../../../knowledge-hub/services/product-service.service';
import { RequestDocument } from '../../../../models/request-document';
import { SubscribeService } from '../../../../services/subscribe.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contactus',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.scss',
})
export class ContactusComponent {
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
    const notOnlyWhitespace = Validators.pattern(/^(?!\s*$).+/);

    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required, notOnlyWhitespace]],
      documentFormatId: ['', Validators.required],
      areaOfFocusId: ['', Validators.required],
      description: ['', [Validators.required, notOnlyWhitespace]],
      language: ['English', Validators.required], // default value can be changed as needed
    });
  }

  loadAreaOfFocus() {
    this.productService.getAllAreaFocus().subscribe({
      next: (data) => {
        this.areaOfFocusList = data;
        // console.log(data);
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
