import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperLoaderComponent } from './stepper-loader.component';

describe('StepperLoaderComponent', () => {
  let component: StepperLoaderComponent;
  let fixture: ComponentFixture<StepperLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
