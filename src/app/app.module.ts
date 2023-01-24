import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CameraComponent } from './camera/camera.component';
import { PanZoomComponent } from './pan-zoom/pan-zoom.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { CameraButtonsComponent } from './camera/camera-buttons/camera-buttons.component';
import { CameraFeedComponent } from './camera/camera-feed/camera-feed.component';
import { GraspComponent } from './grasp/grasp.component';
import { SelectComponent } from './grasp/select/select.component';
import { ConfirmComponent } from './grasp/confirm/confirm.component';
import { GraspingComponent } from './grasp/grasping/grasping.component';
import { TeleopControlComponent } from './teleop-control/teleop-control.component';
import { ContainerComponent } from './container/container.component';
import { FormsModule } from '@angular/forms';
import { ToolbarBtnComponent } from './toolbar/toolbar-btn/toolbar-btn.component';
import { InteractiveMapComponent } from './map/interactive-map/interactive-map.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HammerModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    CameraComponent,
    PanZoomComponent,
    ToolbarComponent,
    CameraButtonsComponent,
    CameraFeedComponent,
    GraspComponent,
    SelectComponent,
    ConfirmComponent,
    GraspingComponent,
    TeleopControlComponent,
    ContainerComponent,
    ToolbarBtnComponent,
    InteractiveMapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSliderModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    HammerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
