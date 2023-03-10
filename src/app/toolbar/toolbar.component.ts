import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RosService } from '../ros.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  rosServiceSub!: Subscription;
  canNavigate!: Subscription;
  disableBtn = false;
  constructor(private rosService: RosService) { }
  ngOnInit(): void {
    this.rosServiceSub = this.rosService.connected.subscribe(
      (value) => {
        if (value) {
          this.initConnections();
        }
      }
    )
  }
  ngOnDestroy(): void {
    this.rosServiceSub.unsubscribe();
    this.canNavigate.unsubscribe();
  }

  initConnections() {
    this.canNavigate = this.rosService.canNavigate.subscribe(
      (value) => {
        this.disableBtn = !value
      }
    )
  }

}
