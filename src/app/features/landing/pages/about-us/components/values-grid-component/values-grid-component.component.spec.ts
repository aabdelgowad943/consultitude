import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuesGridComponentComponent } from './values-grid-component.component';

describe('ValuesGridComponentComponent', () => {
  let component: ValuesGridComponentComponent;
  let fixture: ComponentFixture<ValuesGridComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValuesGridComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValuesGridComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
