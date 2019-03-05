import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../../../../../../services/data-provider.service';
import { PublicationsService } from '../../../../../../services/publications.service';
import { LogsService } from '../../../../../../services/logs.service';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  pageState = 1;

  latestDataProviders: any;
  latestPublications: any;
  latestLogs: any;

  
  constructor(
    private dataProviderService: DataProviderService,
    private publicationsService: PublicationsService,
    private logsService: LogsService
  ) { }

  ngOnInit() {
    this.getLatestData();
  }

  getLatestData(): void {
    this.getLatestDataProviders();
    this.getLatestPublications();
    this.getLatestLogs();
    this.pageState = 0;
  }

  getLatestDataProviders(): void {
    let queryRequest = "?limit=3";
    this.dataProviderService.getDataProviders(queryRequest).subscribe(
      data => this.latestDataProviders = data
    )
  }

  getLatestPublications(): void {
    let queryRequest = "?limit=3";
    this.publicationsService.getPublications(queryRequest).subscribe(
      data => {
        this.latestPublications = data;
      }
    );
  }

  getLatestLogs(): void {
    let queryRequest = "?limit=3";
    this.logsService.getLogs(queryRequest).subscribe(
      data => {
        this.latestLogs = data;
      }
    );
  }



}
