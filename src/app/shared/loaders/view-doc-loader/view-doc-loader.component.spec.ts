import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDocLoaderComponent } from './view-doc-loader.component';

describe('ViewDocLoaderComponent', () => {
  let component: ViewDocLoaderComponent;
  let fixture: ComponentFixture<ViewDocLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewDocLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDocLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
