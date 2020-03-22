import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../auth/authentication.service';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { CoreConfigConstant } from 'src/configconstants';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public updateDetails: FormGroup;
  userID: number = 0;

  username: string = '';
  email: string = '';
  mobile: string = '';
  token: string = '';
  profile = {
    'store_name': '',
    'city': '',
    'state': '',
    'address': '',
    'image': ''
  };
  updateLocal = {
    'username': '',
    'email': '',
    'mobile': '',
    'store_name': '',
    'city': '',
    'state': '',
    'address': '',
    'image': '',
    'token': ''
  };

  isLoading: boolean = false;
  defaultdImg: string = 'http://placehold.it/300x200';
  croppedImagepath: string = '';
  imageName: string = '';
  isLoadingSubscriber;
  croppedImagepathSubscriber;
  img_base: string = CoreConfigConstant.uploadedPath;
  constructor(
    public formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    private uploadImage: ImagesService,
    public actionSheetController: ActionSheetController) { 
      
    const currentUser = this.authenticationService.currentUserValue;
    if(currentUser == undefined) return;
    this.userID = currentUser.id;
    this.img_base = this.img_base + this.userID + 'assets/';
    this.username = currentUser.username;
    this.email = currentUser.email;
    this.mobile = currentUser.mobile;
    this.token = currentUser.token;
    this.profile.store_name = currentUser.store_name;
    this.profile.city = currentUser.city;
    this.profile.state = currentUser.state;
    this.profile.address = currentUser.address;
    this.profile.image = currentUser.image;
    if (this.profile.image) {
      this.croppedImagepath = this.img_base+currentUser.image;
      
    }
    this.updateDetails = formBuilder.group({
      store_name: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')])],
      city: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')])],
      state: ['', Validators.compose([Validators.maxLength(50), Validators.pattern('[a-zA-Z ]*')])],
      address: ['', Validators.compose([Validators.maxLength(250)])],
      image: [this.imageName]
    });
  }
  // get the form contorls in a f object
  get f() { return this.updateDetails.controls; }
  ngOnInit() {
  }
  update() {
    console.log(this.profile);


    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        this.curdService.postData('updateProfile', this.profile)
          .subscribe((data: any) => {

            if (data.status) {
              this.updateLocal.username = this.username;
              this.updateLocal.email = this.email;
              this.updateLocal.mobile = this.username;
              this.updateLocal.store_name = this.profile.store_name;
              this.updateLocal.city = this.profile.city;
              this.updateLocal.state = this.profile.state;
              this.updateLocal.address = this.profile.address;
              this.updateLocal.image = this.profile.image;
              this.updateLocal.token = this.token;
              this.authenticationService.updateUser(this.updateLocal);
              this.appProvider.showToast(data.data);
            } else {
            }
            setTimeout(() => {
              this.appProvider.dismissLoading();
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
  imageSelector(type?:string) {
    if(type== 'camera')
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
          this.profile.image = this.imageName;
          console.log('this.imageName if ' + this.imageName);
        }
        if (typeof this.croppedImagepathSubscriber == 'object'){
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
