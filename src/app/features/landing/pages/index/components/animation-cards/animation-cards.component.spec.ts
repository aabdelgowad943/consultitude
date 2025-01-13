import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationCardsComponent } from './animation-cards.component';

describe('AnimationCardsComponent', () => {
  let component: AnimationCardsComponent;
  let fixture: ComponentFixture<AnimationCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimationCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimationCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
