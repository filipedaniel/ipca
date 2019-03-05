
import { Component, OnInit, NgModule } from '@angular/core';
import { PublicationsService } from '../../../../services/publications.service';

@Component({
  selector: 'app-frontoffice',  
  templateUrl: './frontoffice.component.html',
  styleUrls: ['./frontoffice.component.scss']
})
export class FrontofficeComponent implements OnInit {
  pageState = 1;
  
  totalOfPublications: number;
  endInInfiniteScroll: boolean = false;
  paginationLimit: number = 40;
  paginationSkip: number;
  publications$:any = [];
  currentPage = 1;

  selectSearchOption: string = 'search';
  searchInput: string = '';

  constructor(private publicationsService: PublicationsService) { }

  ngOnInit() {
    this.getPublications(`?limit=${this.paginationLimit}&skip=0`);
  }
  
  search(event): void {
    if (event.target.value == '') {
      this.pageState = 0;
      this.searchInput = '';
      this.publications$ = [];
      this.getPublications();
    } else {
      if(event.keyCode == 13) {
        this.pageState = 1;
        this.publications$ = [];
        
        if (this.selectSearchOption == 'custom') {
          this.searchInput = `?${event.target.value}`;
        } else {
          this.searchInput = `?${this.selectSearchOption}=${event.target.value}`;
        }

        this.getPublications(this.searchInput);
      }
    }
  }

  getPublications(query: string = ''): void {
    this.publicationsService.getPublications(query).subscribe(
      data => {
        this.publications$.push(...data['data']);
        this.paginationLimit = data['limit'];
        this.paginationSkip = data['skip'];
        this.currentPage = data['page'];
        this.pageState = 0;
        this.totalOfPublications = data['total'];
        if (data['data'].length == 0 && this.publications$.length > 0) {
          this.endInInfiniteScroll = true;
        } else {
          this.endInInfiniteScroll = false;
        }
      }
    )
  }

  changeLimit(limit: number): void {
    let query = `limit=${limit}&skip=0`;
    let getQuery = this.searchInput == '' ? `?${query}` : `${this.searchInput}&${query}`;
    this.getPublications(getQuery);
  }

  onScrollDown(ev): void {
    this.currentPage++;
    let skip = this.paginationLimit * (this.currentPage - 1);
    let pageQuery = `limit=${this.paginationLimit}&skip=${skip}`;
    let getQuery = this.searchInput == '' ? `?${pageQuery}` : `${this.searchInput}&${pageQuery}`;
    this.getPublications(getQuery);
  }

}
