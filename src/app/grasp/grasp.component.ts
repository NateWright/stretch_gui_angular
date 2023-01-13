import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RosService } from '../ros.service';
import { GraspService } from './grasp.service';

@Component({
  selector: 'app-grasp',
  template: `
    <router-outlet></router-outlet>
  `,
  styleUrls: ['./grasp.component.css']
})
export class GraspComponent implements OnInit, OnDestroy {
  rosServiceSub!: Subscription;
  errorMsg = ''
  constructor(private rosService: RosService, private graspService: GraspService, private router: Router, private activatedRoute: ActivatedRoute) {
  }
  ngOnDestroy(): void {
    this.rosServiceSub.unsubscribe();
  }
  ngOnInit(): void {
    this.rosService.connected.subscribe(
      (b: boolean) => {
        if (b) {
          this.initSubscriptions();
        }
      }
    )
  }


  initSubscriptions() {
    this.rosServiceSub = this.rosService.clickStatus.subscribe(
      (msg) => {
        //@ts-expect-error
        if (msg.success) {
          this.router.navigate(['confirm'], { relativeTo: this.activatedRoute })
        } else {
          //@ts-expect-error
          this.graspService.errorMsg.next(msg.msg);
        }
      }
    )
    if (this.rosService.canNavigate.value == false || this.rosService.hasObject.value) {
      this.router.navigate(['grasping'], { relativeTo: this.activatedRoute })
    }
  }
}
