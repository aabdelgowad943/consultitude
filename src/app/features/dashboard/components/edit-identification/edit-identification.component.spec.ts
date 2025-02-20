import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditIdentificationComponent } from './edit-identification.component';

describe('EditIdentificationComponent', () => {
  let component: EditIdentificationComponent;
  let fixture: ComponentFixture<EditIdentificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditIdentificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
