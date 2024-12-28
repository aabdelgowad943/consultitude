import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlexLogoComponent } from './flex-logo.component';

describe('FlexLogoComponent', () => {
  let component: FlexLogoComponent;
  let fixture: ComponentFixture<FlexLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlexLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlexLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
