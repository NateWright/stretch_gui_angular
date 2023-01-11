import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RosService } from 'src/app/ros.service';
import * as ROSLIB from 'roslib';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-grasping',
  templateUrl: './grasping.component.html',
  styleUrls: ['./grasping.component.css']
})
export class GraspingComponent implements OnInit, OnDestroy {
  rosServiceSub!: Subscription;
  hasObject = false;
  hasObjectSub!: Subscription;
  canNavigate = true;
  canNavigateSub!: Subscription;
  disableButtons = false;

  constructor(private rosService: RosService, private router: Router, private route: ActivatedRoute) { }
  ngOnDestroy(): void {
    this.rosServiceSub.unsubscribe();
    this.hasObjectSub.unsubscribe();
    this.canNavigateSub.unsubscribe();
  }
  ngOnInit(): void {
    this.rosServiceSub = this.rosService.connected.subscribe(
      (value) => {
        if (value) {
          this.initConnections();
        }
      }
    )
  }

  initConnections() {
    this.hasObjectSub = this.rosService.hasObject.subscribe(
      (value) => {
        this.hasObject = value
      }
    )
    this.canNavigateSub = this.rosService.canNavigate.subscribe(
      (value) => {
        this.canNavigate = value;
      }
    )
  }

  onBack() {
    this.disableButtons = true;
    let request = new ROSLIB.ServiceRequest({});
    this.rosService.homeRobotClient.callService(request, () => {
      this.router.navigate(['../select'], { relativeTo: this.route })
    })
  }

  onStowObject() {
    this.disableButtons = true;
    let request = new ROSLIB.ServiceRequest({});
    this.rosService.stowObjectClient.callService(request, () => {
      this.disableButtons = false;
    })
  }

  onReleaseObject() {
    this.disableButtons = true;
    let request = new ROSLIB.ServiceRequest({});
    this.rosService.stowObjectClient.callService(request, () => {
      this.onBack();
    })
  }
  onReplaceObject() {
    this.disableButtons = true;
    let request = new ROSLIB.ServiceRequest({});
    this.rosService.replaceObjectClient.callService(request, () => {
      this.disableButtons = false;
    })
  }

}
