import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSectionNewLandingComponent } from './hero-section-new-landing.component';

describe('HeroSectionNewLandingComponent', () => {
  let component: HeroSectionNewLandingComponent;
  let fixture: ComponentFixture<HeroSectionNewLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionNewLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSectionNewLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
