import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './camera/camera.component';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
