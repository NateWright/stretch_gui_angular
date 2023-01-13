import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as ROSLIB from 'roslib';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RosService {
  private ros: ROSLIB.Ros;
  connected = new BehaviorSubject<boolean>(false);
  disableButtons = new BehaviorSubject<boolean>(false);

  //Publishers
  pointClicked!: ROSLIB.Topic;
  lineUpClicked!: ROSLIB.Topic;
  cmdVel!: ROSLIB.Topic;

  // Subscribers
  private cameraTopic!: ROSLIB.Topic;
  cameraFeed = new Subject<ROSLIB.Message>();
  private headCameraTopic!: ROSLIB.Topic;
  headCameraFeed = new Subject<string>();
  private segmentedCameraTopic!: ROSLIB.Topic;
  segmentedCameraImage = new BehaviorSubject<ROSLIB.Message>(new ROSLIB.Message(0));
  private mapTopic!: ROSLIB.Topic;
  mapFeed = new BehaviorSubject<ROSLIB.Message>(new ROSLIB.Message(0));
  private robotPoseTopic!: ROSLIB.Topic;
  robotPose = new Subject<ROSLIB.Message>();
  private clickStatusTopic!: ROSLIB.Topic;
  clickStatus = new Subject<ROSLIB.Message>();
  private canNavigateTopic!: ROSLIB.Topic;
  canNavigate = new BehaviorSubject<boolean>(true);
  private hasObjectTopic!: ROSLIB.Topic;
  hasObject = new BehaviorSubject<boolean>(false);
  private movingTopic!: ROSLIB.Topic;
  moving = new BehaviorSubject<boolean>(false);

  private headUpClient!: ROSLIB.Service;
  private headDownClient!: ROSLIB.Service;
  private headLeftClient!: ROSLIB.Service;
  private headRightClient!: ROSLIB.Service;
  private headHomeClient!: ROSLIB.Service;
  private setMappingClient!: ROSLIB.Service;
  private setHeadPanClient!: ROSLIB.Service;
  private setHeadTiltClient!: ROSLIB.Service;
  homeRobotClient!: ROSLIB.Service;
  stowObjectClient!: ROSLIB.Service;
  replaceObjectClient!: ROSLIB.Service;
  releaseObjectClient!: ROSLIB.Service;
  private setHomeClient!: ROSLIB.Service;
  navigateHomeClient!: ROSLIB.Service;

  // Parameters
  objectOrientation!: ROSLIB.Param;
  hasHome!: ROSLIB.Param;
  private cmdVelParam!: ROSLIB.Param;


  constructor(private router: Router, @Inject(DOCUMENT) private document: any) {
    this.ros = new ROSLIB.Ros({});
    this.ros.connect('ws://' + this.document.location.hostname + ':9090');
    this.ros.on('connection', (event: any) => {
      this.subscribeToTopics();
      this.connected.next(true);
    })
    // TODO : Manage the events "disconnect" and "error".
  }

  private subscribeToTopics() {
    console.log("Starting connections")

    // Parameters
    this.objectOrientation = new ROSLIB.Param({
      ros: this.ros,
      name: '/stretch_gui/object_orientation'
    })
    this.hasHome = new ROSLIB.Param({
      ros: this.ros,
      name: '/stretch_gui/has_home'
    })

    this.cmdVelParam = new ROSLIB.Param({
      ros: this.ros,
      name: '/stretch_gui/cmd_vel'
    })

    // Publishers
    this.pointClicked = new ROSLIB.Topic({ ros: this.ros, name: '/stretch_gui/scene_clicked', messageType: 'stretch_gui_library/PointClicked' })
    this.pointClicked.advertise();
    this.lineUpClicked = new ROSLIB.Topic({ ros: this.ros, name: '/stretch_gui/grasp', messageType: 'std_msgs/Empty' })
    this.lineUpClicked.advertise();
    this.cmdVelParam.get(
      (msg: string) => {
        this.cmdVel = new ROSLIB.Topic({ ros: this.ros, name: msg, messageType: 'geometry_msgs/Twist' })
        this.cmdVel.advertise();
      }
    )

    // Subscribers
    this.cameraTopic = new ROSLIB.Topic({ ros: this.ros, name: '/camera/color/image_raw/compressed', messageType: 'sensor_msgs/CompressedImage' })
    this.cameraTopic.subscribe(
      (msg: ROSLIB.Message) => {
        this.cameraFeed.next(msg);
      }
    )
    this.headCameraTopic = new ROSLIB.Topic({ ros: this.ros, name: '/teleop/head_camera/image_raw/compressed', messageType: 'sensor_msgs/CompressedImage' })
    this.headCameraTopic.subscribe(
      (msg: ROSLIB.Message) => {
        // @ts-expect-error
        this.headCameraFeed.next("data:image/jpg;base64," + msg.data)
      }
    )
    this.segmentedCameraTopic = new ROSLIB.Topic({ ros: this.ros, name: '/stretch_gui/image_selection', messageType: 'sensor_msgs/CompressedImage' })
    this.segmentedCameraTopic.subscribe(
      (msg: ROSLIB.Message) => {
        this.segmentedCameraImage.next(msg);
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
    this.canNavigateTopic = new ROSLIB.Topic({ ros: this.ros, name: '/stretch_gui/can_navigate', messageType: 'std_msgs/Bool' })
    this.canNavigateTopic.subscribe(
      (msg) => {
        // @ts-expect-error
        this.canNavigate.next(msg.data);
      }
    )
    this.hasObjectTopic = new ROSLIB.Topic({ ros: this.ros, name: '/stretch_gui/has_object', messageType: 'std_msgs/Bool' })
    this.hasObjectTopic.subscribe(
      (msg) => {
        // @ts-expect-error
        this.hasObject.next(msg.data);
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
    this.homeRobotClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/home_robot',
      serviceType: 'std_srvs/Empty'
    })
    this.stowObjectClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/stow_object',
      serviceType: 'std_srvs/Empty'
    })
    this.replaceObjectClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/replace_object',
      serviceType: 'std_srvs/Empty'
    })
    this.releaseObjectClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/release_object',
      serviceType: 'std_srvs/Empty'
    })
    this.setHomeClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/set_home',
      serviceType: 'std_srvs/Empty'
    })
    this.navigateHomeClient = new ROSLIB.Service({
      ros: this.ros,
      name: '/stretch_gui/navigate_home',
      serviceType: 'std_srvs/Empty'
    })

    if (this.canNavigate.value == false) {
      this.router.navigate(['/grasp', 'grasping'])
    }
    if (this.hasObject.value) {
      this.router.navigate(['/grasp', 'grasping'])
    }
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
  setHome() {
    let request = new ROSLIB.ServiceRequest({})
    this.setHomeClient.callService(request, () => { });
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
