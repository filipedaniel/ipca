import { Component, OnInit } from '@angular/core';
import { LogsService } from '../../../../../../services/logs.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  pageState = 1;
  searchInput: string = '';
  
  logs$: any;
  
  paginationSkip: number;
  paginationLimit: number;
  totalOfLogs: number;

  constructor(
    private logsService: LogsService
  ) { }

  ngOnInit() {
    this.getLogs();
  }

  // Push a search term into the observable stream.
  search(event): void {
    if (event.target.value == '') {
      this.pageState = 0;
      this.searchInput = '';
      this.getLogs();
    } else {
      if(event.keyCode == 13) {
        this.pageState = 1;
        this.searchInput = `?search=${event.target.value}`;
        this.getLogs(this.searchInput);
      }
    }
  }

  pageChanged(event): void {
    let skip = this.paginationLimit * (event.page - 1);
    let pageQuery = `limit=${this.paginationLimit}&skip=${skip}`;
    let getQuery = this.searchInput == '' ? `?${pageQuery}` : `${this.searchInput}&${pageQuery}`;
    this.getLogs(getQuery);
    window.scrollTo(0,0);
  }

  changeLimit(limit: number): void {
    let query = `limit=${limit}&skip=0`;
    let getQuery = this.searchInput == '' ? `?${query}` : `${this.searchInput}&${query}`;
    this.getLogs(getQuery);
  }

  /*********/

  getLogs(query: string = ""): void {
    this.logsService.getLogs(query).subscribe(
      data => {
        this.logs$ = data;
        this.paginationLimit = this.logs$.limit;
        this.paginationSkip = this.logs$.paginationSkip;
        this.totalOfLogs = this.logs$.total;
        this.pageState = 0;
      }
    )
  }

}
