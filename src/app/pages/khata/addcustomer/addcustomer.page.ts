import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { CoreConfigConstant } from 'src/configconstants'
import { AuthenticationService } from '../../auth/authentication.service';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-addcustomer',
  templateUrl: './addcustomer.page.html',
  styleUrls: ['./addcustomer.page.scss'],
})
export class AddcustomerPage implements OnInit {
  public addcustomer: FormGroup;
  customer: any;

  isLoading: boolean = false;
  defaultdImg: string = 'http://placehold.it/300x200';
  croppedImagepath: string = '';
  imageName: string = '';
  isLoadingSubscriber;
  croppedImagepathSubscriber;
  img_base: string = CoreConfigConstant.uploadedPath;
  isMobile:boolean = false;
  constructor(
    public formBuilder: FormBuilder,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    public authenticationService: AuthenticationService,
    private uploadImage: ImagesService,
    public actionSheetController: ActionSheetController
  ) {

    const currentUser = this.authenticationService.currentUserValue;
    let imgUserID = currentUser.id;
    this.img_base = this.img_base + imgUserID + 'assets/';

    this.customer = {
      name: '',
      mobile_number: '',
      image: ''
    }
    this.addcustomer = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      mobile_number: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
      image: [''],
    });
  }

  ngOnInit() {
    this.isMobile = this.appProvider.isMobile();
  }
  // get the form contorls in a f object
  get f() { return this.addcustomer.controls; }

  addCustomer() {

    if (!this.addcustomer.valid) {
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
          };
          let merged = { ...this.customer, ...emptyfields };
          this.curdService.postData(apiMethod, merged)
            .subscribe((data: any) => {

              if (data.status) {
                this.appProvider.showToast(data.data);
                this.addcustomer.reset();
              } else {
                this.appProvider.showToast(data.msg);
              }
              setTimeout(() => {

                this.appProvider.dismissLoading();
                if (data.status)
                  this.appProvider.goto('mykhatas', 1);
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
        this.croppedImagepath = data;
        this.imageName = this.uploadImage.imageFileName();
        if (this.imageName) {
          this.customer.image = this.imageName;
          console.log('this.imageName if ' + this.imageName);


          if (typeof this.croppedImagepathSubscriber == 'object') {
            this.isLoading = false;
            this.croppedImagepathSubscriber.unsubscribe();
            this.isLoadingSubscriber.unsubscribe();
          }

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
      
  }
}
