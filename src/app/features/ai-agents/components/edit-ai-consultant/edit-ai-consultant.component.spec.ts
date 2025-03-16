import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAiConsultantComponent } from './edit-ai-consultant.component';

describe('EditAiConsultantComponent', () => {
  let component: EditAiConsultantComponent;
  let fixture: ComponentFixture<EditAiConsultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAiConsultantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAiConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
