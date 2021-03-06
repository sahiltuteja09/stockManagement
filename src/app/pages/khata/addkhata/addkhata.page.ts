import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { CoreConfigConstant } from '../../../../configconstants';
import { ActionSheetController } from '@ionic/angular';
import { AuthenticationService } from '../../auth/authentication.service';

@Component({
  selector: 'app-addkhata',
  templateUrl: './addkhata.page.html',
  styleUrls: ['./addkhata.page.scss'],
})
export class AddkhataPage implements OnInit {
  //queryParmSub: any;
  khata_type: number = 1;
  mobile: string;
  amount: number = 0;
  khata: any;
  addkhata: FormGroup;
  name: string = 'NA';
  img_url: string = CoreConfigConstant.uploadedPath;
  croppedImagepath: any[] = [];
  isLoading: boolean = false;
  isLoadingSubscriber;
  croppedImagepathSubscriber;
  isMobile: boolean = false;
  countImage: number = 0;
  selectedFile: File[];
  constructor(
    private uploadImage: ImagesService,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    public formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    public actionSheetController: ActionSheetController) {
    // this.queryParmSub = this.route.queryParams.subscribe(params => {
    //   // this.khata_type = params['type'];
    //   // this.mobile = params['mobile'];
    // });
    const currentUser = this.authenticationService.currentUserValue;
    const imgUserID = currentUser.id;
    this.img_url = this.img_url + imgUserID + 'assets/';
    this.khata = {
      'amount': 0,
      'description': '',
      purchase_date: new Date().toISOString()
    };
    this.addkhata = formBuilder.group({
      amount: [this.khata.amount || '', Validators.compose([Validators.required, Validators.min(1)])],
      description: [this.khata.description || '', Validators.compose([Validators.maxLength(200)])],
      purchase_date: [this.khata.purchase_date || '']
    });
  }

  ngOnInit() {
    this.isMobile = this.appProvider.isMobile();
    //this.croppedImagepath = ['1567572520240-cropped.jpg', '1567572520240-cropped.jpg'];
  }
  saveKhata() {
    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let apiMethod = 'save_khata';
        this.khata.mobile = this.mobile;
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
                this.appProvider.searchParam('khata', { queryParams: { 'mobile': this.mobile }, skipLocationChange: true  });
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
    // if(Object.keys(this.croppedImagepath).length == 0){
    //   return false;
    // }
    let param = { 'id': id };
    let images = { 'images': this.croppedImagepath };

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
              // if (data.status)
              //   this.appProvider.goto('mypurchases', 1);
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
  ionViewWillEnter() {
    if (this.appProvider.tempStorageData) {

    let  tempStorage = this.appProvider.tempStorageData;
      this.name = tempStorage.name;
      this.khata_type = tempStorage.type;
      this.mobile = tempStorage.mobile;
      this.khata = {
        'amount': tempStorage.amount,
        'description': tempStorage.description,
        purchase_date: tempStorage.purchase_date
      };

    }
  }
  pickImage(type?: string) {
    if (!this.isMobile)
      return false;
    if (type == 'camera')
      this.uploadImage.captureImage();
    else
      this.uploadImage.pickImage();
    if (typeof this.isLoadingSubscriber != 'object') {
      this.isLoadingSubscriber = this.uploadImage.isLoading.subscribe((data) => {
        console.log('isLoadingSubscriber ' + data);
        this.isLoading = data;
      });
    }
    console.log('typeof this.croppedImagepathSubscriber 1 ' + typeof this.croppedImagepathSubscriber);
    if (typeof this.croppedImagepathSubscriber != 'object') {
      this.croppedImagepathSubscriber = this.uploadImage.croppedImagepath.subscribe((data) => {
        // console.log('croppedImagepathSubscriber '+data);
        let imageName = this.uploadImage.imageFileName();

        if (imageName) {
          if (typeof this.croppedImagepathSubscriber == 'object') {
            this.isLoading = false;
            this.croppedImagepathSubscriber.unsubscribe();
            this.isLoadingSubscriber.unsubscribe();
            this.croppedImagepathSubscriber = '';
            setTimeout(() => {
              if(this.croppedImagepath[this.countImage])
              this.countImage = this.countImage + 1;
              
              this.croppedImagepath[this.countImage] = imageName;
              this.countImage = this.countImage + 1;
            }, 2000);
          }
        }
      });
    }
  }
  async imageSelector() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Camera',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          console.log('Delete clicked');
          this.pickImage('camera');
        }
      }, {
        text: 'Photo albums',
        icon: 'images',
        handler: () => {
          this.pickImage();
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }
  onFileChanged(event) {
    this.selectedFile = event.target.files;//[0];
    const uploadData = new FormData();

    for (const file of this.selectedFile) {
      uploadData.append('photo', file);
  }
  this.selectedFile = event.target.files;//[0];
   //  uploadData.append('photo', this.selectedFile, this.selectedFile.name);
  this.uploadImage.uploadDesktopImage(uploadData).then((data) => {
    if(!data.status.status){
      this.appProvider.showToast(data.status.msg);
    }else{
      this.appProvider.showToast(data.status.msg);

      if(this.croppedImagepath[this.countImage])
      this.countImage = this.countImage + 1;

      this.croppedImagepath[this.countImage] =  data.status.data.file_name;
              this.countImage = this.countImage + 1;

              console.log(this.croppedImagepath);
    }
  }).catch((err) => {
    console.error(err)
  }
  );
}
  removeImg(item, e) {
    e.preventDefault();
    console.log(item);
    console.log(this.croppedImagepath);
   
this.uploadImage.removeImage(item).then(()=> {
  var index = this.croppedImagepath.indexOf(item);
  if (index !== -1) this.croppedImagepath.splice(index, 1);
  this.countImage = this.countImage - 1;
}).catch((err)=> {

});
    
  }
  ionViewWillLeave() {
    if (typeof this.isLoadingSubscriber == 'object')
      this.isLoadingSubscriber.unsubscribe();

    if (typeof this.croppedImagepathSubscriber == 'object')
      this.croppedImagepathSubscriber.unsubscribe();

    this.appProvider.dismissLoading();
    this.croppedImagepathSubscriber = '';
          this.isLoadingSubscriber = '';

          this.appProvider.deleteStorage();

  }
}
