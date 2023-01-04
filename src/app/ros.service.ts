import { Injectable } from '@angular/core';
import * as ROSLIB from 'roslib';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosService {
  private ros: ROSLIB.Ros;
  private connected = new Subject<boolean>();

  private cameraTopic!: ROSLIB.Topic;
  cameraFeed = new Subject<ROSLIB.Message>();
  private mapTopic!: ROSLIB.Topic;
  mapFeed = new BehaviorSubject<ROSLIB.Message>(new ROSLIB.Message(0));
  private robotPoseTopic!: ROSLIB.Topic;
  robotPose = new Subject<ROSLIB.Message>();


  constructor() {
    this.connected.next(false);
    this.ros = new ROSLIB.Ros({});
    this.ros.connect('ws://127.0.0.1:9090');
    this.ros.on('connection', (event: any) => {
      this.connected.next(true);
      this.subscribeToTopics();
    })
    // TODO : Manage the events "disconnect" and "error".
  }

  private subscribeToTopics() {
    console.log("Starting connections")
    this.cameraTopic = new ROSLIB.Topic({ ros: this.ros, name: '/camera/color/image_raw/compressed', messageType: 'sensor_msgs/CompressedImage' })
    this.cameraTopic.subscribe(
      (msg: ROSLIB.Message) => {
        this.cameraFeed.next(msg);
      }
    )
    this.mapTopic = new ROSLIB.Topic({ ros: this.ros, name: '/stretch_gui/map', messageType: 'sensor_msgs/CompressedImage' })
    this.mapTopic.subscribe(
      (msg: ROSLIB.Message) => {
        this.mapFeed.next(msg);
      }
    )
    this.robotPoseTopic = new ROSLIB.Topic({ ros: this.ros, name: '/stretch_gui/pose', messageType: 'stretch_gui_library/MapPose' })
    this.robotPoseTopic.subscribe(
      (msg) => {
        this.robotPose.next(msg);
      }
    )
  }
}
