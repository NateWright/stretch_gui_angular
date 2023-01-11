import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraspingComponent } from './grasping.component';

describe('GraspingComponent', () => {
  let component: GraspingComponent;
  let fixture: ComponentFixture<GraspingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraspingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraspingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
