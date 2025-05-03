import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalkToAiConsultantComponent } from './talk-to-ai-consultant.component';

describe('TalkToAiConsultantComponent', () => {
  let component: TalkToAiConsultantComponent;
  let fixture: ComponentFixture<TalkToAiConsultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalkToAiConsultantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalkToAiConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
