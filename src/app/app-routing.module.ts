import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
import { ConfirmComponent } from './grasp/confirm/confirm.component';
import { GraspComponent } from './grasp/grasp.component';
import { SelectComponent } from './grasp/select/select.component';
import { MapComponent } from './map/map.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
