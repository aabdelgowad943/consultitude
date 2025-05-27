import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskEvoHeaderComponent } from './ask-evo-header.component';

describe('AskEvoHeaderComponent', () => {
  let component: AskEvoHeaderComponent;
  let fixture: ComponentFixture<AskEvoHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskEvoHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskEvoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
