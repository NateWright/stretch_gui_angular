import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { RosService } from '../ros.service';

@Component({
  selector: 'app-camera-feed',
  templateUrl: './camera-feed.component.html',
  styleUrls: ['./camera-feed.component.css']
})
export class CameraFeedComponent implements OnInit, OnDestroy {
  @ViewChild('feed') feed!: ElementRef;
  @Output() pointerEvent = new EventEmitter<{ event: PointerEvent, width: number, height: number }>();
  roslibSub!: Subscription

  imgSource = ''
  cameraSub!: Subscription;

  constructor(private roslibService: RosService) { }

  ngOnDestroy(): void {
    this.cameraSub.unsubscribe();
    this.roslibSub.unsubscribe();
  }
  ngOnInit(): void {
    this.roslibSub = this.roslibService.connected.subscribe(
      (b: boolean) => {
        if (b) {
          this.subscribeToTopics();
        }
      }
    )
  }

  private subscribeToTopics() {
    this.cameraSub = this.roslibService.cameraFeed.subscribe(
      (msg: ROSLIB.Message) => {
        // @ts-expect-error
        this.imgSource = "data:image/jpg;base64," + msg.data
        // this.renderer.setProperty(this.cameraFeed.nativeElement, 'src', "data:image/jpg;base64," + msg.data)
      }
    )
  }

  publishEvent(event: PointerEvent) {
    let width = this.feed.nativeElement.width;
    let height = this.feed.nativeElement.height;

    this.pointerEvent.emit({ event: event, width: width, height: height })
  }

}
