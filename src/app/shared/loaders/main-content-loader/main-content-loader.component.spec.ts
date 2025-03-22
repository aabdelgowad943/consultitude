import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentLoaderComponent } from './main-content-loader.component';

describe('MainContentLoaderComponent', () => {
  let component: MainContentLoaderComponent;
  let fixture: ComponentFixture<MainContentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContentLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainContentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
