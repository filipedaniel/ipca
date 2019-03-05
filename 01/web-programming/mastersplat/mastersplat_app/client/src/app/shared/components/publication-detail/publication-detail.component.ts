import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-publication-detail',
  templateUrl: './publication-detail.component.html',
  styleUrls: ['./publication-detail.component.scss']
})
export class PublicationDetailComponent implements OnInit {
  
  @Input('publication') publication: any;
  
  constructor() { }

  ngOnInit() {
  }

}
