import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultantSelectorDialogComponent } from './consultant-selector-dialog.component';

describe('ConsultantSelectorDialogComponent', () => {
  let component: ConsultantSelectorDialogComponent;
  let fixture: ComponentFixture<ConsultantSelectorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultantSelectorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultantSelectorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
