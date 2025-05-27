import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTemplateLoaderComponent } from './view-template-loader.component';

describe('ViewTemplateLoaderComponent', () => {
  let component: ViewTemplateLoaderComponent;
  let fixture: ComponentFixture<ViewTemplateLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTemplateLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTemplateLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
