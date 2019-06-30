import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';

@Component({
  selector: 'app-scanin',
  templateUrl: './scanin.page.html',
  styleUrls: ['./scanin.page.scss'],
})
export class ScaninPage implements OnInit {
  searchTerm: string = "";
  searching: boolean = false;
  searchControl: FormControl;
  searchApi: string = 'searchByKeyword';
  page: number = 1;
  searchData: any = [];
  noDataFound:string = 'Please enter the keyword or scan qr to search.';

  stock:any;

  constructor(
    private curdService: CurdService,
    private appProvider: CoreAppProvider
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(debounceTime(2000)).subscribe(value => { this.searching = false; this.searchProduct() });
  }
  setFilteredItems() {
    this.searching = true;
  }
  searchProduct() {
    if (this.searchTerm) {
      this.page = 1;
      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          let param = { 'page': this.page, 'term': this.searchTerm };
          this.curdService.getData(this.searchApi, param)
            .subscribe((data: any) => {
              if (data.status == false) {
                // no product found
                this.noDataFound = data.msg;
                this.searchData = [];
              } else {
                this.searchData = data;
                this.page = this.page + 1;
              }

              this.appProvider.dismissLoading();
            },
              error => {
                this.appProvider.showToast(error);
                this.appProvider.dismissLoading();
              }
            );
        });
      });
    } else {
      this.searchData = [];
    }
  }
  doInfinite(infiniteScroll) {

    setTimeout(() => {
      let param = { 'page': this.page, 'term': this.searchTerm };
      this.curdService.getData(this.searchApi, param)
        .subscribe(
          (data: any) => {
            if (data.status == false) {
              // no product found
              this.noDataFound = data.msg;
            } else {
              this.searchData.data.push(data.data);
              this.page = this.page + 1;
            }
          },
          error => {
            this.appProvider.showToast(error);
          }
        );
      infiniteScroll.target.complete();
    }, 2000);
  }
  
  updateStock(quantity, productId){
    console.log(productId);
  }

}
