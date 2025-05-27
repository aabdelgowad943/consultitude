import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSectionForEvoComponent } from './header-section-for-evo.component';

describe('HeaderSectionForEvoComponent', () => {
  let component: HeaderSectionForEvoComponent;
  let fixture: ComponentFixture<HeaderSectionForEvoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSectionForEvoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSectionForEvoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
