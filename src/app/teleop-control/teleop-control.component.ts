import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import * as ROSLIB from 'roslib';
import { Subscription, timer } from 'rxjs';
import { RosService } from '../ros.service';

@Component({
  selector: 'app-teleop-control',
  templateUrl: './teleop-control.component.html',
  styleUrls: ['./teleop-control.component.css']
})
export class TeleopControlComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;
  triangleUp = new Path2D();
  triangleDown = new Path2D();
  triangleLeft = new Path2D();
  triangleRight = new Path2D();

  rosServiceSub!: Subscription;

  headCameraSub!: Subscription;
  headCameraImage = new Image();

  moveSub!: Subscription;

  angularSpeed = 0.1;
  angularMinSpeed = 0.1;
  angularMaxSpeed = 1;
  linearSpeed = 0.1;
  linearMinSpeed = 0.1;
  linearMaxSpeed = 1;


  constructor(private renderer: Renderer2, private rosService: RosService) { }
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
    this.headCameraSub.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.context = this.renderer.selectRootElement(this.canvas).nativeElement.getContext('2d');
    this.context.canvas.width = this.canvas.nativeElement.offsetWidth;
    this.context.canvas.height = this.canvas.nativeElement.offsetHeight;
    this.createTriangles();
  }

  initConnections() {
    this.headCameraSub = this.rosService.headCameraFeed.subscribe(
      (data: string) => {
        this.headCameraImage.src = data;
        this.headCameraImage.onload =
          (event) => {
            this.paint();
          }
      }
    )
  }

  createTriangles() {
    let width = this.renderer.selectRootElement(this.canvas).nativeElement.offsetWidth;
    let height = this.renderer.selectRootElement(this.canvas).nativeElement.offsetHeight;

    // console.log(width)
    // console.log(height)

    // Triangle Up
    this.triangleUp.moveTo(0, 0);
    this.triangleUp.lineTo(width, 0);
    this.triangleUp.lineTo(width / 2, height / 2);
    this.triangleUp.closePath();
    // Triangle Down
    this.triangleDown.moveTo(width, height);
    this.triangleDown.lineTo(width / 2, height / 2);
    this.triangleDown.lineTo(0, height);
    this.triangleDown.closePath();
    // Triangle Left
    this.triangleLeft.moveTo(0, 0);
    this.triangleLeft.lineTo(width / 2, height / 2);
    this.triangleLeft.lineTo(0, height);
    this.triangleLeft.closePath();
    // Triangle Right
    this.triangleRight.moveTo(width, 0);
    this.triangleRight.lineTo(width / 2, height / 2);
    this.triangleRight.lineTo(width, height);
    this.triangleRight.closePath();
  }

  paint() {
    if (this.context) {
      this.context.drawImage(this.headCameraImage, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.context.beginPath();
      this.context.moveTo(0, 0);
      this.context.lineTo(this.canvas.nativeElement.width, this.canvas.nativeElement.height)
      this.context.moveTo(this.canvas.nativeElement.width, 0);
      this.context.lineTo(0, this.canvas.nativeElement.height)
      this.context.stroke();
    }
  }
  clickHandler(event: PointerEvent) {
    let msg = {
      linear: {
        x: 0,
        y: 0,
        z: 0
      },
      angular: {
        x: 0,
        y: 0,
        z: 0
      }
    }
    if (this.context.isPointInPath(this.triangleUp, event.offsetX, event.offsetY)) {
      msg.linear.x = this.linearSpeed;
    } else if (this.context.isPointInPath(this.triangleDown, event.offsetX, event.offsetY)) {
      msg.linear.x = -this.linearSpeed;
    } else if (this.context.isPointInPath(this.triangleLeft, event.offsetX, event.offsetY)) {
      msg.angular.z = this.angularSpeed;
    } else if (this.context.isPointInPath(this.triangleRight, event.offsetX, event.offsetY)) {
      msg.angular.z = -this.angularSpeed;
    }

    this.moveSub = timer(0, 200).subscribe(
      () => {
        this.rosService.cmdVel.publish(new ROSLIB.Message(msg));
      }
    )
  }
  reset() {
    this.moveSub.unsubscribe();
  }

  disableContext() {
    return false;
  }
}
