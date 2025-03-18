import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapidResponseDialogComponent } from './rapid-response-dialog.component';

describe('RapidResponseDialogComponent', () => {
  let component: RapidResponseDialogComponent;
  let fixture: ComponentFixture<RapidResponseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapidResponseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapidResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
