import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoProductToShowComponent } from './no-product-to-show.component';

describe('NoProductToShowComponent', () => {
  let component: NoProductToShowComponent;
  let fixture: ComponentFixture<NoProductToShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoProductToShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoProductToShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
