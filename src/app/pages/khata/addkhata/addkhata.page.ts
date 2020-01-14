import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-addkhata',
  templateUrl: './addkhata.page.html',
  styleUrls: ['./addkhata.page.scss'],
})
export class AddkhataPage implements OnInit {
  queryParmSub: any;
  khata_type:number= 1;
  mobile:string;
  amount:number = 0;
  khata:any;
  addkhata:FormGroup;
  name:string='NA';
  constructor(private route: ActivatedRoute, private appProvider: CoreAppProvider, private curdService: CurdService,public formBuilder: FormBuilder) { 
    this.queryParmSub = this.route.queryParams.subscribe(params => {
      this.khata_type = params['type'];
      this.mobile = params['mobile'];
    });

    this.khata = {
      'amount': 0,
      'description': '',
      purchase_date:new Date().toISOString()
    };
    this.addkhata = formBuilder.group({
      amount: ['', Validators.compose([Validators.required, Validators.min(1)])],
      description: ['', Validators.compose([Validators.maxLength(200)])],
      purchase_date:['']
    });
  }

  ngOnInit() {
  }
  saveKhata(){
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let apiMethod = 'save_khata';
        this.khata.mobile= this.mobile;
        this.khata.type = this.khata_type;
        this.khata.name = this.name;

        var startdate = new Date(this.khata.purchase_date);
        this.khata.purchase_date = startdate.getFullYear() + '-' + (startdate.getMonth() < 10 ? '0' + ((startdate.getMonth()) * 1 + 1) : ((startdate.getMonth()) * 1 + 1)) + '-' + (startdate.getDate() < 10 ? '0' + startdate.getDate() : startdate.getDate());

        this.curdService.postData(apiMethod, this.khata)
          .subscribe((data: any) => {

            if (data.status) {
              this.appProvider.showToast(data.data);
              this.addkhata.reset();
            } else {
              this.appProvider.showToast(data.msg);
            }
            setTimeout(() => {
              
              this.appProvider.dismissLoading();
             if (data.status)
             this.appProvider.searchParam('khata', {queryParams: {'mobile':this.mobile}});
            }, 2000);

          },
            error => {
              this.appProvider.showToast(error);
              this.appProvider.dismissLoading();
            },
            () => {
            }
          );
      });
    });
  }
  ionViewWillEnter(){
    if(this.appProvider.tempStorage)
   this.name = this.appProvider.tempStorage.name;
  }
}
