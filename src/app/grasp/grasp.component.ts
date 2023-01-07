import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RosService } from '../ros.service';

@Component({
  selector: 'app-grasp',
  templateUrl: './grasp.component.html',
  styleUrls: ['./grasp.component.css']
})
export class GraspComponent implements OnInit {
  constructor(private rosService: RosService, private router: Router, private activatedRoute: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.rosService.connected.subscribe(
      (b: boolean) => {
        if (b) {
          this.initSubscriptions();
        }
      }
    )
  }


  initSubscriptions() {
    this.rosService.clickStatus.subscribe(
      (msg) => {
        //@ts-expect-error
        if (msg.success) {
          this.router.navigate(['confirm'], { relativeTo: this.activatedRoute })
          console.log('success')
        }
      }
    )
  }
}
