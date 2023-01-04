import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RosService } from '../ros.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit, OnDestroy {

  imgSource = ''
  cameraSub!: Subscription;

  constructor(private roslibService: RosService) { }
  ngOnDestroy(): void {
    this.cameraSub.unsubscribe();
  }
  ngOnInit(): void {
    this.cameraSub = this.roslibService.cameraFeed.subscribe(
      (msg: ROSLIB.Message) => {
        // @ts-expect-error
        this.imgSource = "data:image/jpg;base64," + msg.data
        // this.renderer.setProperty(this.cameraFeed.nativeElement, 'src', "data:image/jpg;base64," + msg.data)
      }
    )
  }
}
