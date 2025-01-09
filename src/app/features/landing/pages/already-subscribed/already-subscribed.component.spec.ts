import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadySubscribedComponent } from './already-subscribed.component';

describe('AlreadySubscribedComponent', () => {
  let component: AlreadySubscribedComponent;
  let fixture: ComponentFixture<AlreadySubscribedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlreadySubscribedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlreadySubscribedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
