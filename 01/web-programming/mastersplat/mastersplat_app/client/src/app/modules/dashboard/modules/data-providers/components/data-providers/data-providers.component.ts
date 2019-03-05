import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataProviderService } from '../../../../../../services/data-provider.service';
import { DataProvider } from '../../../../../../shared/classes/data-provider';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateUrl } from '../../../../../../shared/validators/url.validator';


@Component({
  selector: 'app-data-providers',
  templateUrl: './data-providers.component.html',
  styleUrls: ['./data-providers.component.scss']
})
export class DataProvidersComponent implements OnInit {
  pageState = 1;
  searchQuery: string = '';
  
  modalRef: BsModalRef;
  dataProviders$: any;
  
  paginationSkip: number;
  paginationLimit: number;
  totalOfDataProviders: number;

  rForm: FormGroup;
  post: any;
  name:string = "";
  url:string = "";

  searchInput: string = '';
  constructor(
    private modalService: BsModalService,
    private dataProviderService: DataProviderService,
    private formBuilder: FormBuilder
  ) {
    this.rForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'url': ['', [Validators.required, ValidateUrl]]
    });
  }

  ngOnInit() {
    this.getDataProviders();
  }
  
  search(event): void {
    if (event.target.value == '') {
      this.pageState = 0;
      this.searchInput = '';
      this.getDataProviders();
    } else {
      if(event.keyCode == 13) {
        this.pageState = 1;
        this.searchInput = `?search=${event.target.value}`;
        this.getDataProviders(this.searchInput);
      }
    }
  }

  openModalWithClass(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'mp-modal' })
    );
  }

  pageChanged(event): void {
    //this.pageState = 1;
    let skip = this.paginationLimit * (event.page - 1);
    let pageQuery = `limit=${this.paginationLimit}&skip=${skip}`;
    let getQuery = this.searchInput == '' ? `?${pageQuery}` : `${this.searchInput}&${pageQuery}`;
    this.getDataProviders(getQuery);
    window.scrollTo(0, 0);
  }

  changeLimit(limit: number): void {
    let query = `limit=${limit}&skip=0`;
    let getQuery = this.searchInput == '' ? `?${query}` : `${this.searchInput}&${query}`;
    this.getDataProviders(getQuery);
  }

  /*********/

  getDataProviders(query: string = ""): void {
    this.dataProviderService.getDataProviders(query).subscribe(
      data => {
        this.dataProviders$ = data;
        this.paginationLimit = this.dataProviders$.limit;
        this.paginationSkip = this.dataProviders$.paginationSkip;
        this.totalOfDataProviders = this.dataProviders$.total;
        this.pageState = 0;
      }
    )
  }

  addDataProvider(post): void {
    let n = post.name.trim();
    let u = post.url.trim();
    if (!post.name || !post.url) { return; }
    let dataprovider = new DataProvider(n,u);

    this.dataProviderService.addDataProvider(dataprovider).subscribe(
      data => { 
        this.getDataProviders();
        this.modalRef.hide()
      }
    )
  }

  harvestAllDataProvider(): void {
    this.dataProviderService.harvestAllDataProviders().subscribe(
      () => this.getDataProviders()
    )
  }

  refreshDataProviders(): void {
    this.getDataProviders();
  }
  
}
