import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveEmailComponent } from './active-email.component';

describe('ActiveEmailComponent', () => {
  let component: ActiveEmailComponent;
  let fixture: ComponentFixture<ActiveEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
