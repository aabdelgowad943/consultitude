import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseDepthComponent } from './response-depth.component';

describe('ResponseDepthComponent', () => {
  let component: ResponseDepthComponent;
  let fixture: ComponentFixture<ResponseDepthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponseDepthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponseDepthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
