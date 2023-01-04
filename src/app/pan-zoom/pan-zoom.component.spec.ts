import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanZoomComponent } from './pan-zoom.component';

describe('PanZoomComponent', () => {
  let component: PanZoomComponent;
  let fixture: ComponentFixture<PanZoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanZoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanZoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
