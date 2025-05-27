import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultingSuggestionComponent } from './consulting-suggestion.component';

describe('ConsultingSuggestionComponent', () => {
  let component: ConsultingSuggestionComponent;
  let fixture: ComponentFixture<ConsultingSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultingSuggestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultingSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
