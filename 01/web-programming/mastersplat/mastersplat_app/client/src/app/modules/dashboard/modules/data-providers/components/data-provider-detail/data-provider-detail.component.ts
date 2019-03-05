import { Component, OnInit, Input } from '@angular/core';
import { DataProviderService } from '../../../../../../services/data-provider.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateUrl } from '../../../../../../shared/validators/url.validator';

@Component({
  selector: 'app-data-provider-detail',
  templateUrl: './data-provider-detail.component.html',
  styleUrls: ['./data-provider-detail.component.scss']
})
export class DataProviderDetailComponent implements OnInit {
  @Input() dataProvider: any;
  pageStatus: number = 1;
  
  rForm: FormGroup;
  post: any;
  name:string = "";
  url:string = "";
  
  constructor(
    private route: ActivatedRoute,
    private dataProviderService: DataProviderService,
    private formBuilder: FormBuilder,
    private location: Location) {}
    
    ngOnInit() {
      this.getDataProvider();
    }

  getDataProvider(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    this.dataProviderService.getDataProvider(id)
      .subscribe(data => {
        this.dataProvider = data['data'];
        this.rForm = this.formBuilder.group({
          'name': [this.dataProvider.name, Validators.required],
          'url': [this.dataProvider.url, [Validators.required, ValidateUrl]]
        });
        this.pageStatus = 0;
      });

  }
 
  goBack(): void {
    this.location.back();
  }

  updateDataProvider(post): void {
    let n = post.name.trim();
    let u = post.url.trim();
    if (!post.name || !post.url) { return; }

    this.dataProvider.name = n;
    this.dataProvider.url = u;
    
    this.dataProviderService.updateDataProvider(this.dataProvider)
      .subscribe(
        () => this.goBack()
     )
  }

  deleteDataProvider(): void {
    this.dataProviderService.deleteDataProvider(this.dataProvider._id)
      .subscribe(
        () => this.goBack()
      )
  }

  loadHarvestDataProvider(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.dataProviderService.harvestDataProvider(id).subscribe(
      () => this.getDataProvider()
    )
  }

  updateHarvestDataProvider(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.dataProviderService.harvestDataProvider(id).subscribe(
      () => this.getDataProvider()
    )
  }

  refreshDataProvider(): void {
    this.getDataProvider();
  }
}
