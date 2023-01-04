import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-pan-zoom',
  template: `
  <div style="overflow: hidden; 3px solid red">
    <img id="scene" #scene src="{{ src }}" 
    (pointerup)="this.pointerUp.next($event)" 
    (pointerdown)="this.pointerDown.next($event)"
    (pinch)="test($event)">
  </div>
  `,
  styleUrls: ['./pan-zoom.component.css']
})
export class PanZoomComponent {
  @ViewChild('scene', { static: false }) scene!: ElementRef;
  panZoomController: any;
  zoomLevels!: number[];
  @Input() src = '';
  @Output() pointerDown = new EventEmitter<PointerEvent>()
  @Output() pointerUp = new EventEmitter<PointerEvent>()

  currentZoomLevel!: number;

  // zoom() {
  //   const isSmooth = false;
  //   const scale = this.currentZoomLevel;

  //   if (scale) {
  //     const transform = this.panZoomController.getTransform();
  //     const deltaX = transform.x;
  //     const deltaY = transform.y;
  //     const offsetX = scale + deltaX;
  //     const offsetY = scale + deltaY;

  //     if (isSmooth) {
  //       this.panZoomController.smoothZoom(0, 0, scale);
  //     } else {
  //       this.panZoomController.zoomTo(offsetX, offsetY, scale);
  //     }
  //   }
  // }

  // zoomToggle(zoomIn: boolean) {
  //   const idx = this.zoomLevels.indexOf(this.currentZoomLevel);
  //   if (zoomIn) {
  //     if (typeof this.zoomLevels[idx + 1] !== 'undefined') {
  //       this.currentZoomLevel = this.zoomLevels[idx + 1];
  //     }
  //   } else {
  //     if (typeof this.zoomLevels[idx - 1] !== 'undefined') {
  //       this.currentZoomLevel = this.zoomLevels[idx - 1];
  //     }
  //   }
  //   if (this.currentZoomLevel === 1) {
  //     this.panZoomController.moveTo(0, 0);
  //     this.panZoomController.zoomAbs(0, 0, 1);
  //   } else {
  //     this.zoom();
  //   }
  // }
  test(event: any) {
    console.log(event)
  }

  ngAfterViewInit() {

  }
}
