import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RosService } from '../ros.service';

@Component({
  selector: 'app-teleop-control',
  templateUrl: './teleop-control.component.html',
  styleUrls: ['./teleop-control.component.css']
})
export class TeleopControlComponent implements OnInit, OnDestroy {
  rosServiceSub!: Subscription;

  headCameraSub!: Subscription;
  headCameraSource = ''


  constructor(private rosService: RosService) { }
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
    this.rosServiceSub.unsubscribe();
  }

  initConnections() {
    this.headCameraSub = this.rosService.headCameraFeed.subscribe(
      (data: string) => {
        this.headCameraSource = data;
      }
    )
  }
}
