import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantCardComponent } from './consultant-card.component';

describe('ConsultantCardComponent', () => {
  let component: ConsultantCardComponent;
  let fixture: ComponentFixture<ConsultantCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
