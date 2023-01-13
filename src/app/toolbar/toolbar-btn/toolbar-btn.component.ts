import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar-btn',
  templateUrl: './toolbar-btn.component.html',
  styleUrls: ['./toolbar-btn.component.css']
})
export class ToolbarBtnComponent {
  @Input() link = ''
}
