import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultitudeTemplatesComponent } from './consultitude-templates.component';

describe('ConsultitudeTemplatesComponent', () => {
  let component: ConsultitudeTemplatesComponent;
  let fixture: ComponentFixture<ConsultitudeTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultitudeTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultitudeTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
