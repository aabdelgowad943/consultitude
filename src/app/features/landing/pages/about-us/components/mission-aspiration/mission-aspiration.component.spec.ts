import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionAspirationComponent } from './mission-aspiration.component';

describe('MissionAspirationComponent', () => {
  let component: MissionAspirationComponent;
  let fixture: ComponentFixture<MissionAspirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionAspirationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MissionAspirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
