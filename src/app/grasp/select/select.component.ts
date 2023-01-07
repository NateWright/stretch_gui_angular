import { Component } from '@angular/core';
import * as ROSLIB from 'roslib';
import { RosService } from 'src/app/ros.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent {

  constructor(private rosService: RosService) { }

  sceneClicked(event: { event: PointerEvent, width: number, height: number }) {
    let msg = new ROSLIB.Message({
      x: Math.floor(event.event.offsetX),
      y: Math.floor(event.event.offsetY),
      width: event.width,
      height: event.height
    })
    console.log(msg);
    this.rosService.pointClicked.publish(msg)
  }
}
