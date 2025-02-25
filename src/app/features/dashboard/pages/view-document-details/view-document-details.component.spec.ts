import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocumentDetailsComponent } from './view-document-details.component';

describe('ViewDocumentDetailsComponent', () => {
  let component: ViewDocumentDetailsComponent;
  let fixture: ComponentFixture<ViewDocumentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocumentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDocumentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
