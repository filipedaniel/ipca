import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-frontoffice-publication-item',
  templateUrl: './frontoffice-publication-item.component.html'
})
export class FrontofficePublicationItemComponent implements OnInit {
  @Input('publication') publication : any;
  constructor() { }

  ngOnInit() {
  }

}
