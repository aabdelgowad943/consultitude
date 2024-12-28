import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfullySubscribedComponent } from './successfully-subscribed.component';

describe('SuccessfullySubscribedComponent', () => {
  let component: SuccessfullySubscribedComponent;
  let fixture: ComponentFixture<SuccessfullySubscribedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessfullySubscribedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessfullySubscribedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
