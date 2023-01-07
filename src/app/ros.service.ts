import { Injectable } from '@angular/core';
import * as ROSLIB from 'roslib';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosService {
  private ros: ROSLIB.Ros;
  connected = new BehaviorSubject<boolean>(false);

  //Publishers
  pointClicked!: ROSLIB.Topic;

  // Subscribers
  private cameraTopic!: ROSLIB.Topic;
  cameraFeed = new Subject<ROSLIB.Message>();
  private mapTopic!: ROSLIB.Topic;
  mapFeed = new BehaviorSubject<ROSLIB.Message>(new ROSLIB.Message(0));
  private robotPoseTopic!: ROSLIB.Topic;
  robotPose = new Subject<ROSLIB.Message>();
  private clickStatusTopic!: ROSLIB.Topic;
  clickStatus = new Subject<ROSLIB.Message>();

  private headUpClient!: ROSLIB.Service;
  private headDownClient!: ROSLIB.Service;
  private headLeftClient!: ROSLIB.Service;
  private headRightClient!: ROSLIB.Service;
  private headHomeClient!: ROSLIB.Service;
  private setMappingClient!: ROSLIB.Service;
  private setHeadPanClient!: ROSLIB.Service;
  private setHeadTiltClient!: ROSLIB.Service;


  constructor() {
    this.ros = new ROSLIB.Ros({});
    this.ros.connect('ws://127.0.0.1:9090');
    this.ros.on('connection', (event: any) => {
      this.subscribeToTopics();
      this.connected.next(true);
    })
    // TODO : Manage the events "disconnect" and "error".
  }

  private subscribeToTopics() {
    console.log("Starting connections")

    // Publishers
    this.pointClicked = new ROSLIB.Topic({ ros: this.ros, name: '/stretch_gui/scene_clicked', messageType: 'stretch_gui_library/PointClicked' })
    this.pointClicked.advertise();

    // Subscribers
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
    this.clickStatusTopic = new ROSLIB.Topic({ ros: this.ros, name: '/stretch_gui/click_status', messageType: 'stretch_gui_library/PointStatus' })
    this.clickStatusTopic.subscribe(
      (msg) => {
        this.clickStatus.next(msg);
      }
    )

    // Clients
    this.headUpClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/head_up',
      serviceType: 'std_srvs/Empty'
    })

    this.headDownClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/head_down',
      serviceType: 'std_srvs/Empty'
    })
    this.headLeftClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/head_left',
      serviceType: 'std_srvs/Empty'
    })
    this.headRightClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/head_right',
      serviceType: 'std_srvs/Empty'
    })
    this.headHomeClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/head_home',
      serviceType: 'std_srvs/Empty'
    })
    this.setMappingClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/set_mapping',
      serviceType: 'stretch_gui_library/SetMapping'
    })
    this.setHeadPanClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/set_head_pan',
      serviceType: 'stretch_gui_library/Double'
    })
    this.setHeadTiltClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/set_head_tilt',
      serviceType: 'stretch_gui_library/Double'
    })

  }

  headUp() {
    let request = new ROSLIB.ServiceRequest({});
    this.headUpClient.callService(request, () => { });
  }

  headDown() {
    let request = new ROSLIB.ServiceRequest({});
    this.headDownClient.callService(request, () => { });
  }
  headLeft() {
    let request = new ROSLIB.ServiceRequest({});
    this.headLeftClient.callService(request, () => { });
  }
  headRight() {
    let request = new ROSLIB.ServiceRequest({});
    this.headRightClient.callService(request, () => { });
  }
  headHome() {
    let request = new ROSLIB.ServiceRequest({});
    this.headHomeClient.callService(request, () => { });
  }

  setMapping(b: boolean) {
    let request = new ROSLIB.ServiceRequest({
      mapping: b
    })
    this.setMappingClient.callService(request, () => { });
  }
  setHeadPan(deg: number) {
    let request = new ROSLIB.ServiceRequest({
      data: deg
    })

    this.setHeadPanClient.callService(request, () => { });
  }

  setHeadTilt(deg: number) {
    let request = new ROSLIB.ServiceRequest({
      data: deg
    })

    this.setHeadTiltClient.callService(request, () => { });
  }

  changeToNavigation() {
    this.setHeadPan(0);
    this.setHeadTilt(-30);
    this.setMapping(true);
  }

  changeToCamera() {
    this.setMapping(false);
  }

}
