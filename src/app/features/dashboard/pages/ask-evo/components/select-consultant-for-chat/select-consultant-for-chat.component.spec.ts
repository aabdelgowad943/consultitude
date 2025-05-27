import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectConsultantForChatComponent } from './select-consultant-for-chat.component';

describe('SelectConsultantForChatComponent', () => {
  let component: SelectConsultantForChatComponent;
  let fixture: ComponentFixture<SelectConsultantForChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectConsultantForChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectConsultantForChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
