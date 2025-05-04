import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalkToConsultantComponent } from './talk-to-consultant.component';

describe('TalkToConsultantComponent', () => {
  let component: TalkToConsultantComponent;
  let fixture: ComponentFixture<TalkToConsultantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalkToConsultantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalkToConsultantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
