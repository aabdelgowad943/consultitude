import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatToConStartedComponent } from './chat-to-con-started.component';

describe('ChatToConStartedComponent', () => {
  let component: ChatToConStartedComponent;
  let fixture: ComponentFixture<ChatToConStartedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatToConStartedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatToConStartedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
