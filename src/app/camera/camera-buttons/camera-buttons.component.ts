import { Component } from '@angular/core';
import { RosService } from '../../ros.service';

@Component({
  selector: 'app-camera-buttons',
  templateUrl: './camera-buttons.component.html',
  styleUrls: ['./camera-buttons.component.css']
})
export class CameraButtonsComponent {
  constructor(public rosService: RosService) { }
}
