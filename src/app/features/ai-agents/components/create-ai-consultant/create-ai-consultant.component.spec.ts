import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAiConsultantComponent } from './create-ai-consultant.component';

describe('CreateAiConsultantComponent', () => {
  let component: CreateAiConsultantComponent;
  let fixture: ComponentFixture<CreateAiConsultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAiConsultantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAiConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
