import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as ROSLIB from 'roslib';
import { Subscription } from 'rxjs';
import { RosService } from 'src/app/ros.service';
import { GraspService } from '../grasp.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit, OnDestroy {

  rosServiceSub!: Subscription;
  segmentedImg = ''
  imageSelectionSub!: Subscription;
  objectOrientation = true;

  constructor(private graspService: GraspService, private rosService: RosService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.rosServiceSub = this.rosService.connected.subscribe(
      (val: boolean) => {
        if (val) {
          this.initConnections();
        }
      }
    )
  }
  ngOnDestroy(): void {
    this.imageSelectionSub.unsubscribe();
    this.rosServiceSub.unsubscribe();
  }

  initConnections() {
    this.rosService.objectOrientation.get(
      (value: boolean) => {
        this.objectOrientation = value
      }
    )
    this.imageSelectionSub = this.rosService.segmentedCameraImage.subscribe(
      (msg) => {
        //@ts-expect-error
        this.segmentedImg = "data:image/jpg;base64," + msg.data
      }
    )
  }

  onVertical() {
    this.rosService.objectOrientation.set(true, () => { });
    this.objectOrientation = true;
  }
  onHorizontal() {
    this.rosService.objectOrientation.set(false, () => { })
    this.objectOrientation = false;
  }

  onYes() {
    this.rosService.lineUpClicked.publish(new ROSLIB.Message({}));
    this.router.navigate(['../grasping'], { relativeTo: this.route })
  }
  onNo() {
    this.router.navigate(['../select'], { relativeTo: this.route })
  }
}
