import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskEvoComponent } from './ask-evo.component';

describe('AskEvoComponent', () => {
  let component: AskEvoComponent;
  let fixture: ComponentFixture<AskEvoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskEvoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskEvoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
