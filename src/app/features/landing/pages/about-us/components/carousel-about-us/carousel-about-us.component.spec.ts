import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselAboutUsComponent } from './carousel-about-us.component';

describe('CarouselAboutUsComponent', () => {
  let component: CarouselAboutUsComponent;
  let fixture: ComponentFixture<CarouselAboutUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselAboutUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselAboutUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
