import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentStepperComponent } from './document-stepper.component';

describe('DocumentStepperComponent', () => {
  let component: DocumentStepperComponent;
  let fixture: ComponentFixture<DocumentStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentStepperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
