import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroLoungeSecionComponent } from './hero-lounge-secion.component';

describe('HeroLoungeSecionComponent', () => {
  let component: HeroLoungeSecionComponent;
  let fixture: ComponentFixture<HeroLoungeSecionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroLoungeSecionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroLoungeSecionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
