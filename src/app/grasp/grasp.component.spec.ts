import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraspComponent } from './grasp.component';

describe('GraspComponent', () => {
  let component: GraspComponent;
  let fixture: ComponentFixture<GraspComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraspComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
