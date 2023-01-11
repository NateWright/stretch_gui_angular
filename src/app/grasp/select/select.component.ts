import { Component, OnInit } from '@angular/core';
import * as ROSLIB from 'roslib';
import { Subscription } from 'rxjs';
import { RosService } from 'src/app/ros.service';
import { GraspService } from '../grasp.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
  graspSub!: Subscription;
  errorMsg = '';

  constructor(private rosService: RosService, private graspService: GraspService) { }

  ngOnInit(): void {
    this.graspSub = this.graspService.errorMsg.subscribe(
      (msg: string) => {
        this.errorMsg = msg;
      }
    )
  }

  sceneClicked(event: { event: PointerEvent, width: number, height: number }) {
    let msg = new ROSLIB.Message({
      x: Math.floor(event.event.offsetX),
      y: Math.floor(event.event.offsetY),
      width: event.width,
      height: event.height
    })
    this.rosService.pointClicked.publish(msg)
  }
}
