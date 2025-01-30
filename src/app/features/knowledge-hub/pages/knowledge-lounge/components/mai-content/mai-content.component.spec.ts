import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaiContentComponent } from './mai-content.component';

describe('MaiContentComponent', () => {
  let component: MaiContentComponent;
  let fixture: ComponentFixture<MaiContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaiContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaiContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
