import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreConfigConstant } from 'src/configconstants'
import { AuthenticationService } from '../../auth/authentication.service';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { ActionSheetController } from '@ionic/angular';
import { NativeContactService } from 'src/app/providers/contact/native-contact.service';

@Component({
  selector: 'app-addvendor',
  templateUrl: './addvendor.page.html',
  styleUrls: ['./addvendor.page.scss'],
})
export class AddvendorPage implements OnInit {

  
  public addvendor: FormGroup;
  vendor: any;

  isLoading: boolean = false;
  defaultdImg: string = 'http://placehold.it/300x200';
  croppedImagepath: string = '';
  imageName: string = '';
  isLoadingSubscriber;
  croppedImagepathSubscriber;
  img_base: string = CoreConfigConstant.uploadedPath;
  isMobile:boolean = false;
  selectedFile: File[];
  constructor(
    public formBuilder: FormBuilder,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    public authenticationService: AuthenticationService,
    private uploadImage: ImagesService,
    public actionSheetController: ActionSheetController, 
    private contact:NativeContactService
  ) {

    const currentUser = this.authenticationService.currentUserValue;
    let imgUserID = currentUser.id;
    this.img_base = this.img_base + imgUserID + 'assets/';

    this.vendor = {
      name: '',
      mobile_number: '',
      image: ''
    }
    this.addvendor = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      mobile_number: ['', Validators.compose([Validators.maxLength(10),Validators.minLength(10), Validators.required])],
      image: [''],
    });
  }

  ngOnInit() {
    this.isMobile = this.appProvider.isMobile();
  }
  getContact(){
    this.contact.pickContact().then(()=>{
      if(this.contact.contactDetail.mobile){
      let mobileNumber = this.contact.contactDetail.mobile.replace(/ +/g, "");
      this.vendor.mobile_number = mobileNumber.substr(mobileNumber.length - 10);
      }
      this.vendor.name = this.contact.contactDetail.name;
      console.log(this.contact.contactDetail);
    }).catch((err)=>{

    });
   
  }
  // get the form contorls in a f object
  get f() { return this.addvendor.controls; }

  addVendor() {

    if (!this.addvendor.valid) {
      console.log('form');
      return;
    }
    else {

      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          let apiMethod = 'save_customer';
          let emptyfields = {
            'amount_paid': '0',
            'amount_received': '0',
            'description': '',
            'purchase_id': 0,
            'purchase_date': '',
            'is_vendor':1,
            'is_update':0
          };
          let merged = { ...this.vendor, ...emptyfields };
          this.curdService.postData(apiMethod, merged)
            .subscribe((data: any) => {

              if (data.status) {
                this.appProvider.showToast(data.data);
                this.addvendor.reset();
              } else {
                this.appProvider.showToast(data.msg);
              }
              setTimeout(() => {

                this.appProvider.dismissLoading();
                if (data.status)
                  this.appProvider.searchParam('purchases', { queryParams: { mobile:  merged.mobile_number, name:merged.name }, replaceUrl: true });
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
  }

  async pickImage() {
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Camera',
        role: 'destructive',
        icon: 'camera',
        handler: () => {
          console.log('Delete clicked');
          this.imageSelector('camera');
        }
      }, {
        text: 'Photo albums',
        icon: 'images',
        handler: () => {
          this.imageSelector();
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
  imageSelector(type?: string) {
    if (!this.isMobile)
      return false;
      if (type == 'camera')
      this.uploadImage.captureImage();
    else
      this.uploadImage.pickImage();

    if (typeof this.isLoadingSubscriber != 'object') {
      this.isLoadingSubscriber = this.uploadImage.isLoading.subscribe((data) => {
        this.isLoading = data;
      });
    }
    if (typeof this.croppedImagepathSubscriber != 'object') {
      this.croppedImagepathSubscriber = this.uploadImage.croppedImagepath.subscribe((data) => {
        
        this.imageName = this.uploadImage.imageFileName();
        if (this.imageName) {
          this.croppedImagepath = data;
          this.vendor.image = this.imageName;
          console.log('this.imageName if ' + this.imageName);
        }

        if (typeof this.croppedImagepathSubscriber == 'object') {
          
          this.isLoading = false;
          this.croppedImagepathSubscriber.unsubscribe();
          this.isLoadingSubscriber.unsubscribe();

          this.croppedImagepathSubscriber = '';
          this.isLoadingSubscriber= '';
        }

        console.log('this.imageName ' + this.imageName);

      });
    }
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
      this.vendor.image =  data.status.data.file_name;
      this.croppedImagepath = this.img_base+this.vendor.image;
    }
  }).catch((err) => {
    console.error(err)
  }
  );
}
  ionViewWillLeave() {
    if (typeof this.isLoadingSubscriber == 'object')
      this.isLoadingSubscriber.unsubscribe();

    if (typeof this.croppedImagepathSubscriber == 'object')
      this.croppedImagepathSubscriber.unsubscribe();

        this.appProvider.dismissLoading();

        this.croppedImagepathSubscriber = '';
            this.isLoadingSubscriber= '';
      
  }

}
