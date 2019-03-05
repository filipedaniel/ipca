import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-publication-item',
  templateUrl: './publication-item.component.html'
})
export class PublicationItemComponent implements OnInit {
  
  @Input('publication') publication: Object;

  constructor() { }

  ngOnInit() {
  }

}
