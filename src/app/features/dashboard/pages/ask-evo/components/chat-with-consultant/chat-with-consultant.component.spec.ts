import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWithConsultantComponent } from './chat-with-consultant.component';

describe('ChatWithConsultantComponent', () => {
  let component: ChatWithConsultantComponent;
  let fixture: ComponentFixture<ChatWithConsultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWithConsultantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatWithConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
