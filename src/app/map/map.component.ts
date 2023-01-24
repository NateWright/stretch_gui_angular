import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as ROSLIB from 'roslib';
import { Subscription } from 'rxjs';
import { RobotPose, RosService } from '../ros.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  mapImage = new Image();
  mapSub!: Subscription;

  robotImage = new Image();
  robotPoseSub!: Subscription;
  robotPose: RobotPose = { point: { x: 0, y: 0 }, rotation: 0 }
  rosServiceSub!: Subscription;

  hasHome = false;

  constructor(private rosService: RosService) { }

  ngOnInit(): void {
    this.rosServiceSub = this.rosService.connected.subscribe(
      (b: boolean) => {
        if (b) {
          this.initConnections();
        }
      }
    )
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.mapSub.unsubscribe();
    this.robotPoseSub.unsubscribe();
    this.rosServiceSub.unsubscribe();
  }

  initConnections() {
    this.rosService.changeToNavigation();
    this.robotImage.src = "./assets/stretch-pixel-art.png"
    this.mapSub = this.rosService.mapFeed.subscribe(
      (msg: ROSLIB.Message) => {
        let img = new Image()
        // @ts-expect-error
        if (!msg.data) {
          img.src = './assets/no-image.png'
        } else {
          // @ts-expect-error
          img.src = "data:image/jpg;base64," + msg.data
        }
        img.onload = () => {
          this.mapImage = img;
        }
      }
    )
    this.robotPoseSub = this.rosService.robotPose.subscribe(
      (msg: RobotPose) => {
        this.robotPose = msg;
      }
    )
    this.rosService.hasHome.get((b: boolean) => {
      this.hasHome = b;
    });
  }
  onSetHome() {
    this.rosService.setHome();
    this.hasHome = true;
  }
  onNavigateHome() {
    this.rosService.disableButtons.next(true)
    let request = new ROSLIB.ServiceRequest({});
    this.rosService.navigateHomeClient.callService(request, () => {
      this.rosService.disableButtons.next(false)
    })
  }
}
