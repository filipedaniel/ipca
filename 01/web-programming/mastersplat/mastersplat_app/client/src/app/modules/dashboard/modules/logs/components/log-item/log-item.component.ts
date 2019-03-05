import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-log-item',
  templateUrl: './log-item.component.html',
  styleUrls: ['./log-item.component.scss']
})
export class LogItemComponent implements OnInit {
  
  @Input('log') log: Object;
  
  constructor() { }

  ngOnInit() {
  }

}
