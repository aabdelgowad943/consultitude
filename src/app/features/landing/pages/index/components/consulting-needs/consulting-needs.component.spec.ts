import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultingNeedsComponent } from './consulting-needs.component';

describe('ConsultingNeedsComponent', () => {
  let component: ConsultingNeedsComponent;
  let fixture: ComponentFixture<ConsultingNeedsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultingNeedsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultingNeedsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
