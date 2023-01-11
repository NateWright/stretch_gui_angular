import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { RosService } from '../ros.service';

@Injectable({
  providedIn: 'root'
})
export class GraspService implements OnInit, OnDestroy {
  errorMsg = new Subject<string>()
  segmentedImgSub!: Subscription;
  segmentedImg = new BehaviorSubject<string>('');
  constructor(private rosService: RosService) { }
  ngOnDestroy(): void {
    this.segmentedImgSub.unsubscribe();
  }

  ngOnInit(): void {
    this.segmentedImgSub = this.rosService.segmentedCameraImage.subscribe(
      (msg) => {
        console.log('image selection received')
        //// @ts-expect-error
        // this.segmentedImg.next("data:image/jpg;base64," + msg.data);

      }
    )
  }

}
