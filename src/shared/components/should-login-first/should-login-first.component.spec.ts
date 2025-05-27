import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShouldLoginFirstComponent } from './should-login-first.component';

describe('ShouldLoginFirstComponent', () => {
  let component: ShouldLoginFirstComponent;
  let fixture: ComponentFixture<ShouldLoginFirstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShouldLoginFirstComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShouldLoginFirstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
