import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeleopControlComponent } from './teleop-control.component';

describe('TeleopControlComponent', () => {
  let component: TeleopControlComponent;
  let fixture: ComponentFixture<TeleopControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeleopControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeleopControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
