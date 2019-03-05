import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LogsService } from '../../../../../../services/logs.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-log-detail',
  templateUrl: './log-detail.component.html',
  styleUrls: ['./log-detail.component.scss']
})
export class LogDetailComponent implements OnInit {
  
  @Input() log: any;
  pageStatus: number = 1;

  constructor(
    private route: ActivatedRoute,
    private logsService: LogsService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getLog();
  }

  getLog(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.logsService.getLog(id).subscribe(
      data => {
        this.log = data['data'];
        this.pageStatus = 0;
      }
    )
  }

  goBack(): void {
    this.location.back();
  }

}
