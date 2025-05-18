import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalkToConsultantFromEvoHomeComponent } from './talk-to-consultant-from-evo-home.component';

describe('TalkToConsultantFromEvoHomeComponent', () => {
  let component: TalkToConsultantFromEvoHomeComponent;
  let fixture: ComponentFixture<TalkToConsultantFromEvoHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalkToConsultantFromEvoHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalkToConsultantFromEvoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
