import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as ROSLIB from 'roslib';
import { Subscription } from 'rxjs';
import { RosService } from '../ros.service';

interface RobotPose {
  rotation: number,
  point: {
    x: number,
    y: number
  }
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('map') map!: ElementRef<HTMLCanvasElement>;
  private context!: CanvasRenderingContext2D;
  mapImage = new Image();
  mapSub!: Subscription;

  robotImage = new Image();
  robotPoseSub!: Subscription;
  robotPose: RobotPose = { rotation: 0, point: { x: 0, y: 0 } };

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
    // @ts-expect-error
    this.context = this.map.nativeElement.getContext('2d')
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
        // @ts-expect-error
        if (!msg.data) {
          this.mapImage.src = './assets/no-image.png'
        } else {
          // @ts-expect-error
          this.mapImage.src = "data:image/jpg;base64," + msg.data
        }
        if (this.context) {
          this.updateImage();
        }
      }
    )
    this.robotPoseSub = this.rosService.robotPose.subscribe(
      (msg: ROSLIB.Message) => {
        // console.log(msg)
        // @ts-expect-error
        this.robotPose.rotation = msg.rotation
        // @ts-expect-error
        this.robotPose.point = msg.point
        if (this.context) {
          this.updateImage();
        }
      }
    )
    this.rosService.hasHome.get((b: boolean) => {
      this.hasHome = b;
    });
  }

  updateImage() {
    this.context.drawImage(this.mapImage, 0, 0, this.map.nativeElement.width, this.map.nativeElement.height);
    this.context.fillStyle = "#FF0000";

    let imageWidth = this.robotImage.width * this.map.nativeElement.width / this.mapImage.width / 10;
    let imageHeight = this.robotImage.height * this.map.nativeElement.height / this.mapImage.height / 10;
    let imagePosX = (this.robotPose.point.x * this.map.nativeElement.width / this.mapImage.width)
    let imagePosY = (this.robotPose.point.y * this.map.nativeElement.height / this.mapImage.height)

    this.context.save();
    this.context.translate(imagePosX + imageWidth / 2, imagePosY + imageHeight / 2);
    this.context.rotate(-this.robotPose.rotation - Math.PI / 2);
    this.context.translate(-(imagePosX + imageWidth / 2), -(imagePosY + imageHeight / 2));
    // this.context.fillRect(this.robotPose.point.x * this.map.nativeElement.width / this.mapImage.width - 10, this.robotPose.point.y * this.map.nativeElement.height / this.mapImage.height - 10, 20, 20);
    this.context.drawImage(this.robotImage,
      imagePosX,
      imagePosY,
      imageWidth,
      imageHeight)
    this.context.restore();
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
