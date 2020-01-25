import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { CoreConfigConstant } from '../../../../configconstants';

@Component({
  selector: 'app-addkhata',
  templateUrl: './addkhata.page.html',
  styleUrls: ['./addkhata.page.scss'],
})
export class AddkhataPage implements OnInit {
  //queryParmSub: any;
  khata_type:number= 1;
  mobile:string;
  amount:number = 0;
  khata:any;
  addkhata:FormGroup;
  name:string='NA';
  img_url:string = CoreConfigConstant.uploadedPath;
  croppedImagepath:any[] = [];
  isLoading: boolean = false;
  isLoadingSubscriber;
  croppedImagepathSubscriber;
  isMobile:boolean = false;
  constructor(private uploadImage: ImagesService, private appProvider: CoreAppProvider, private curdService: CurdService,public formBuilder: FormBuilder) { 
    // this.queryParmSub = this.route.queryParams.subscribe(params => {
    //   // this.khata_type = params['type'];
    //   // this.mobile = params['mobile'];
    // });

    this.khata = {
      'amount': 0,
      'description': '',
      purchase_date:new Date().toISOString()
    };
    this.addkhata = formBuilder.group({
      amount: [this.khata.amount || '', Validators.compose([Validators.required, Validators.min(1)])],
      description: [this.khata.description || '', Validators.compose([Validators.maxLength(200)])],
      purchase_date:[this.khata.purchase_date || '']
    });
  }

  ngOnInit() {
    this.isMobile = this.appProvider.isMobile();
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
              this.saveKhataImage(data.id);
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
  saveKhataImage(id) {
    let param = { 'id': id };
    let images = { 'image': this.croppedImagepath };

    let merged = { ...param, ...images };
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let apiMethod = 'saveKhataImage';
        this.curdService.postData(apiMethod, merged)
          .subscribe((data: any) => {

            if (data.status) {
              this.appProvider.showToast(data.data);

            } else {
              this.appProvider.showToast(data.msg);
            }
            setTimeout(() => {

              this.appProvider.dismissLoading();
              if (data.status)
                this.appProvider.goto('mypurchases', 1);
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
    if(this.appProvider.tempStorage){
      console.log(this.appProvider.tempStorage);
      this.name = this.appProvider.tempStorage.name;
      this.khata_type = this.appProvider.tempStorage.type;
      this.mobile = this.appProvider.tempStorage.mobile;
      this.khata = {
        'amount': this.appProvider.tempStorage.amount,
        'description': this.appProvider.tempStorage.description,
        purchase_date:this.appProvider.tempStorage.purchase_date
      };

    }
  }
  pickImage() {
    if(!this.isMobile)
    return false;
    this.uploadImage.pickImage();
    if (typeof this.isLoadingSubscriber != 'object') {
      this.isLoadingSubscriber = this.uploadImage.isLoading.subscribe((data) => {
        console.log('isLoadingSubscriber '+data);
        this.isLoading = data;
      });
    }
    if (typeof this.croppedImagepathSubscriber != 'object') {
      this.croppedImagepathSubscriber = this.uploadImage.croppedImagepath.subscribe((data) => {
        console.log('croppedImagepathSubscriber '+data);
        let imageName = this.uploadImage.imageFileName();
        this.croppedImagepath[imageName] = imageName;
        if (imageName) {
          if (typeof this.croppedImagepathSubscriber == 'object'){
            this.isLoading = false;
            this.croppedImagepathSubscriber.unsubscribe();
            this.isLoadingSubscriber.unsubscribe();
          }
        }
      });
    }
  }
  ionViewWillLeave() {
    if (typeof this.isLoadingSubscriber == 'object')
      this.isLoadingSubscriber.unsubscribe();

    if (typeof this.croppedImagepathSubscriber == 'object')
      this.croppedImagepathSubscriber.unsubscribe();
     
        this.appProvider.dismissLoading();
      
  }
}