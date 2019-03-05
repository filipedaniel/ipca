import { Component, OnInit } from '@angular/core';
import { PublicationsService } from '../../../../../../services/publications.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {
  pageState = 1;
  searchInput: string = '';
  
  publications$: any;
  
  paginationSkip: number;
  paginationLimit: number;
  totalOfPublications: number;

  constructor(
    private publicationsService: PublicationsService
  ) { }

  ngOnInit() {
    this.getPublications();
  }

  // Push a search term into the observable stream.
  search(event): void {
    if (event.target.value == '') {
      this.pageState = 0;
      this.searchInput = '';
      this.getPublications();
    } else {
      if(event.keyCode == 13) {
        this.pageState = 1;
        this.searchInput = `?search=${event.target.value}`;
        this.getPublications(this.searchInput);
      }
    }
  }

  pageChanged(event): void {
    //this.pageState = 1;
    let skip = this.paginationLimit * (event.page - 1);
    let pageQuery = `limit=${this.paginationLimit}&skip=${skip}`;
    let getQuery = this.searchInput == '' ? `?${pageQuery}` : `${this.searchInput}&${pageQuery}`;
    this.getPublications(getQuery);
    window.scrollTo(0, 0);
  }

  changeLimit(limit: number): void {
    let query = `limit=${limit}&skip=0`;
    let getQuery = this.searchInput == '' ? `?${query}` : `${this.searchInput}&${query}`;
    this.getPublications(getQuery);
  }

  /*********/

  getPublications(query: string = ""): void {
    this.publicationsService.getPublications(query).subscribe(
      data => {
        this.publications$ = data;
        this.paginationLimit = this.publications$.limit;
        this.paginationSkip = this.publications$.paginationSkip;
        this.totalOfPublications = this.publications$.total;
        this.pageState = 0;
      }
    )
  }

}
