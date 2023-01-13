import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarBtnComponent } from './toolbar-btn.component';

describe('ToolbarBtnComponent', () => {
  let component: ToolbarBtnComponent;
  let fixture: ComponentFixture<ToolbarBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarBtnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
