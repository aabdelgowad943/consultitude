import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsultantToSuggestedComponent } from './add-consultant-to-suggested.component';

describe('AddConsultantToSuggestedComponent', () => {
  let component: AddConsultantToSuggestedComponent;
  let fixture: ComponentFixture<AddConsultantToSuggestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddConsultantToSuggestedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddConsultantToSuggestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
