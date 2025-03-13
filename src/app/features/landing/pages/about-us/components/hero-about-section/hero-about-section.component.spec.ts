import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroAboutSectionComponent } from './hero-about-section.component';

describe('HeroAboutSectionComponent', () => {
  let component: HeroAboutSectionComponent;
  let fixture: ComponentFixture<HeroAboutSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroAboutSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroAboutSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
