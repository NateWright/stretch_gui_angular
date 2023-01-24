import { AfterViewInit, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { RobotPose } from 'src/app/ros.service';

@Component({
  selector: 'app-interactive-map',
  template: `
      <canvas #canvas
        class="w-full h-full" (pinch)="test($event)" (tap)="test2($event)"> </canvas>
    `,
  styleUrls: ['./interactive-map.component.css']
})
export class InteractiveMapComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  context!: CanvasRenderingContext2D;
  @Input() set map(val: HTMLImageElement) {
    this.mapImage = val;
    this.updateImage();
  }
  mapImage!: HTMLImageElement;
  @Input() set robotImg(val: HTMLImageElement) {
    this.robotImage = val;
    this.updateImage();
  }
  robotImage!: HTMLImageElement;
  @Input() set sRobotPose(val: RobotPose) {
    this.robotPose = val;
    this.updateImage();
  }
  robotPose!: RobotPose;
  tpCache: Touch[] = [];

  lastScale = 1;
  scale = 1;
  x = 0
  y = 0
  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.context = this.renderer.selectRootElement(this.canvas).nativeElement.getContext('2d');
    this.context.canvas.width = this.canvas.nativeElement.offsetWidth;
    this.context.canvas.height = this.canvas.nativeElement.offsetHeight;
    this.x = this.context.canvas.width / 2;
    this.y = this.context.canvas.height / 2;
    this.updateImage();
  }

  // drag(event: TouchEvent) {
  //   console.log(event)
  //   if (event.targetTouches.length === 2 && event.changedTouches.length === 2) {
  //     // Check if the two target touches are the same ones that started
  //     // the 2-touch
  //     this.tpCache.reverse();
  //     const point1 = this.tpCache.findIndex(
  //       (tp: Touch) => tp.identifier === event.targetTouches[0].identifier, {}
  //     );
  //     const point2 = this.tpCache.findIndex(
  //       (tp: Touch) => tp.identifier === event.targetTouches[1].identifier
  //     );
  //     this.tpCache.reverse();
  //     if (point1 >= 0 && point2 >= 0) {
  //       // Calculate the difference between the start and move coordinates
  //       const diff1 = Math.abs(this.tpCache[point1].clientX - event.targetTouches[0].clientX);
  //       const diff2 = Math.abs(this.tpCache[point2].clientX - event.targetTouches[1].clientX);

  //       // This threshold is device dependent as well as application specific
  //       event.target.
  //       const PINCH_THRESHOLD = ev.target.clientWidth / 10;
  //       if (diff1 >= PINCH_THRESHOLD && diff2 >= PINCH_THRESHOLD) {
  //         ev.target.style.background = "green";
  //       } else {
  //         // empty tpCache
  //         this.tpCache = []
  //       }

  //     }
  //   }
  // }

  test(event: any) {
    console.log(event)
    this.scale = event.scale
    this.x = event.center.x
    this.y = event.center.y


    this.updateImage();
  }
  test2(event: any) {
    // console.log(event)
  }

  updateImage() {
    if (!this.mapImage || !this.robotImage || !this.robotPose) {
      return;
    }
    let mapImage = this.mapImage;
    let canvas = this.canvas.nativeElement;
    let robotPose = this.robotPose;

    this.context.clearRect(0, 0, canvas.width, canvas.height);
    this.context.save();
    this.context.setTransform(this.scale, 0, 0, this.scale, this.x - canvas.width, this.y - canvas.height);
    this.context.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    this.context.fillStyle = "#FF0000";
    this.context.fillRect(canvas.width / 2, 0, 20, 20);

    let imageWidth = this.robotImage.width * canvas.width / mapImage.width / 10;
    let imageHeight = this.robotImage.height * canvas.height / mapImage.height / 10;
    let imagePosX = (robotPose.point.x * canvas.width / mapImage.width)
    let imagePosY = (robotPose.point.y * canvas.height / mapImage.height)

    this.context.save();
    this.context.translate(imagePosX + imageWidth / 2, imagePosY + imageHeight / 2);
    this.context.rotate(-robotPose.rotation - Math.PI / 2);
    this.context.translate(-(imagePosX + imageWidth / 2), -(imagePosY + imageHeight / 2));
    this.context.drawImage(this.robotImage,
      imagePosX,
      imagePosY,
      imageWidth,
      imageHeight)
    this.context.restore();
    this.context.restore();
    // console.log(canvas.width, canvas.height)
    // this.context.scale(0.5, 0.5)
    // this.context.translate(this.canvas.nativeElement.width / 2, this.canvas.nativeElement.height / 2)
    // this.context.setTransform(this.scale, 0, 0, this.scale, this.x, this.y);

  }

}
