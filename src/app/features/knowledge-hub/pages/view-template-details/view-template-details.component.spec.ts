import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTemplateDetailsComponent } from './view-template-details.component';

describe('ViewTemplateDetailsComponent', () => {
  let component: ViewTemplateDetailsComponent;
  let fixture: ComponentFixture<ViewTemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTemplateDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
