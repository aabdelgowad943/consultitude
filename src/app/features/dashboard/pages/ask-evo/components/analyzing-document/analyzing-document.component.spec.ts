import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzingDocumentComponent } from './analyzing-document.component';

describe('AnalyzingDocumentComponent', () => {
  let component: AnalyzingDocumentComponent;
  let fixture: ComponentFixture<AnalyzingDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyzingDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyzingDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
