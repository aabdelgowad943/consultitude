import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowledgeLoungeComponent } from './knowledge-lounge.component';

describe('KnowledgeLoungeComponent', () => {
  let component: KnowledgeLoungeComponent;
  let fixture: ComponentFixture<KnowledgeLoungeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnowledgeLoungeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnowledgeLoungeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
