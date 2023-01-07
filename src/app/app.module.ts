import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CameraComponent } from './camera/camera.component';
import { PanZoomComponent } from './pan-zoom/pan-zoom.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CameraButtonsComponent } from './camera-buttons/camera-buttons.component';
import { CameraFeedComponent } from './camera-feed/camera-feed.component';
import { GraspComponent } from './grasp/grasp.component';
import { SelectComponent } from './grasp/select/select.component';
import { ConfirmComponent } from './grasp/confirm/confirm.component';

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
    ConfirmComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
