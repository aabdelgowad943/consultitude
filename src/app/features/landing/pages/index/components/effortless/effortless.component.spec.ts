import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EffortlessComponent } from './effortless.component';

describe('EffortlessComponent', () => {
  let component: EffortlessComponent;
  let fixture: ComponentFixture<EffortlessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EffortlessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EffortlessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
