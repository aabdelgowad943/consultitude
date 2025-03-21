import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisProgressComponent } from './analysis-progress.component';

describe('AnalysisProgressComponent', () => {
  let component: AnalysisProgressComponent;
  let fixture: ComponentFixture<AnalysisProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
