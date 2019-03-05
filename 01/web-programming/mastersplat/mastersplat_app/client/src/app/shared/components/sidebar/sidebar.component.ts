import { Component, OnInit } from '@angular/core';
import { flyInOutAnimation } from '../../../utils/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    flyInOutAnimation
  ]
})
export class SidebarComponent implements OnInit {
  expandSidebar: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  onToggleSidebar(): void {
    this.expandSidebar = !this.expandSidebar;
  }
  onToggleSidebarFalse(): void {
    this.expandSidebar = false;
  }

}
