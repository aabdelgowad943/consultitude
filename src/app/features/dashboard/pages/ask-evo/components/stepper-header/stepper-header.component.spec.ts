import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperHeaderComponent } from './stepper-header.component';

describe('StepperHeaderComponent', () => {
  let component: StepperHeaderComponent;
  let fixture: ComponentFixture<StepperHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
