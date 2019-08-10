import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../auth/authentication.service';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { CoreConfigConstant } from 'src/configconstants';

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
  constructor(
    public formBuilder: FormBuilder,
    public authenticationService: AuthenticationService,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    private uploadImage: ImagesService
  ) {

    const currentUser = this.authenticationService.currentUserValue;
    this.userID = currentUser.id;

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
      this.croppedImagepath = CoreConfigConstant.uploadedPath+currentUser.image;
      
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

  pickImage() {

    if (typeof this.isLoadingSubscriber != 'object') {
      this.isLoadingSubscriber = this.uploadImage.isLoading.subscribe((data) => {
        this.isLoading = data;
      });
    }
    if (typeof this.croppedImagepathSubscriber != 'object') {
      this.croppedImagepathSubscriber = this.uploadImage.croppedImagepath.subscribe((data) => {
        this.croppedImagepath = data;
        this.imageName = this.uploadImage.imageFileName();
        if (this.imageName) {
          this.profile.image = this.imageName;
          console.log('this.imageName if ' + this.imageName);
        }

        console.log('this.imageName ' + this.imageName);
        this.isLoadingSubscriber.unsubscribe();
        if (typeof this.croppedImagepathSubscriber == 'object')
          this.croppedImagepathSubscriber.unsubscribe();
      });
    }

    this.uploadImage.pickImage();
  }

  ionViewWillLeave() {
    if (typeof this.isLoadingSubscriber == 'object')
      this.isLoadingSubscriber.unsubscribe();
    if (typeof this.croppedImagepathSubscriber == 'object')
      this.croppedImagepathSubscriber.unsubscribe();
  }

}
