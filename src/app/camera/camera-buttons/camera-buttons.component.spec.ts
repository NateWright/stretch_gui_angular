import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraButtonsComponent } from './camera-buttons.component';

describe('CameraButtonsComponent', () => {
  let component: CameraButtonsComponent;
  let fixture: ComponentFixture<CameraButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
