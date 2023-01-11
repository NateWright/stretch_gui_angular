import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
import { ConfirmComponent } from './grasp/confirm/confirm.component';
import { GraspComponent } from './grasp/grasp.component';
import { GraspingComponent } from './grasp/grasping/grasping.component';
import { SelectComponent } from './grasp/select/select.component';
import { MapComponent } from './map/map.component';
import { TeleopControlComponent } from './teleop-control/teleop-control.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CameraComponent
  }, {
    path: 'camera',
    component: CameraComponent
  }, {
    path: 'map',
    component: MapComponent
  }, {
    path: 'teleop',
    component: TeleopControlComponent
  }, {
    path: 'grasp',
    component: GraspComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'select'
      }, {
        path: 'select',
        component: SelectComponent
      }, {
        path: 'confirm',
        component: ConfirmComponent
      }, {
        path: 'grasping',
        component: GraspingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
