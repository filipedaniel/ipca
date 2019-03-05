import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PublicationsService } from '../../../../services/publications.service';

@Component({
  selector: 'app-frontoffice-publication',
  templateUrl: './frontoffice-publication.component.html',
  styleUrls: ['./frontoffice-publication.component.scss']
})
export class FrontofficePublicationComponent implements OnInit {
  @Input() publication: any;
  pageStatus: number = 1;
  
  constructor(
    private route: ActivatedRoute,
    private publicationsService: PublicationsService,
    private location: Location ) { }

  ngOnInit() {
    this.getPublication();
  }
  
  getPublication(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.publicationsService.getPublication(id)
      .subscribe(data => {
        this.publication = data['data'];
        this.pageStatus = 0;
      });
  }

  goBack(): void {
    this.location.back();
  }

}
