import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SseTestComponent } from './sse-test.component';

describe('SseTestComponent', () => {
  let component: SseTestComponent;
  let fixture: ComponentFixture<SseTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SseTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SseTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
