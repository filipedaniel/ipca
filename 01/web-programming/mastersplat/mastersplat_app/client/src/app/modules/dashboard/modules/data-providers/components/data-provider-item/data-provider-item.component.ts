import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-data-provider-item',
  templateUrl: './data-provider-item.component.html',
  styleUrls: ['./data-provider-item.component.scss']
})
export class DataProviderItemComponent implements OnInit {
  
  @Input('dataprovider') dataprovider: Object;
  constructor( ) { }

  ngOnInit() {
  }

}
