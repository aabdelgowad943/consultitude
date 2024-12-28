import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlayImageForBackgroundComponent } from './overlay-image-for-background.component';

describe('OverlayImageForBackgroundComponent', () => {
  let component: OverlayImageForBackgroundComponent;
  let fixture: ComponentFixture<OverlayImageForBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OverlayImageForBackgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverlayImageForBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
