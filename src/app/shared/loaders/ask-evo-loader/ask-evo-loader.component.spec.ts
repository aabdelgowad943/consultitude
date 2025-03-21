import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskEvoLoaderComponent } from './ask-evo-loader.component';

describe('AskEvoLoaderComponent', () => {
  let component: AskEvoLoaderComponent;
  let fixture: ComponentFixture<AskEvoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AskEvoLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskEvoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
