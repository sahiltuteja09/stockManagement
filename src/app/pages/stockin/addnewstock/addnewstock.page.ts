import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../auth/authentication.service';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';

interface Stock {
  product_unique: string;
  product_name: string;
  other_uid: string;
  amazon: string;
  description: string;
  flipkart: string;
  paytm: string;
  product_qty: number;
  purchase_cost: number;
}

@Component({
  selector: 'app-addnewstock',
  templateUrl: './addnewstock.page.html',
  styleUrls: ['./addnewstock.page.scss'],
})
export class AddnewstockPage implements OnInit {
  stock: Stock = <Stock>{};
  croppedImagepath = "";
  isLoading = false;

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50
  };
  public newstockdetail: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    private crop: Crop,
    private imagePicker: ImagePicker,
    private file: File
  ) {


    this.stock = {
      'product_unique': '',
      'product_name': '',
      'other_uid': '',
      'amazon': '',
      'description': '',
      'flipkart': '',
      'paytm': '',
      'product_qty': 0,
      'purchase_cost': 0
    }

    this.newstockdetail = formBuilder.group({
      product_unique: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      purchase_cost: ['', Validators.compose([Validators.maxLength(5), Validators.required])],
      product_qty: ['', Validators.compose([Validators.maxLength(5), Validators.required])],
      product_name: ['', Validators.compose([Validators.maxLength(80), Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(200)])],
      amazon: ['', Validators.compose([Validators.maxLength(30)])],
      flipkart: ['', Validators.compose([Validators.maxLength(30)])],
      paytm: ['', Validators.compose([Validators.maxLength(30)])],
      other_uid: ['', Validators.compose([Validators.maxLength(30)])],
    });
  }

  ngOnInit() {
  }
  // get the form contorls in a f object
  get f() { return this.newstockdetail.controls; }
  newStock() {

    if (!this.newstockdetail.valid) {
      console.log('form');
    }
    else {
      console.log(this.stock);

      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          this.curdService.postData('save_product', this.stock)
            .subscribe((data: any) => {

              if (data.status) {
                this.appProvider.showToast(data.data);
                this.newstockdetail.reset();
              } else {
                this.appProvider.showToast(data.msg);
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
  }

  pickImage() {
    this.imagePicker.getPictures(this.imagePickerOptions).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.cropImage(results[i]);
      }
    }, (err) => {
      alert(err);
    });
  }

  cropImage(imgPath) {
    this.crop.crop(imgPath, { quality: 50 })
      .then(
        newPath => {
          this.showCroppedImage(newPath.split('?')[0])
        },
        error => {
          alert('Error cropping image' + error);
        }
      );
  }

  showCroppedImage(ImagePath) {
    this.isLoading = true;
    var copyPath = ImagePath;
    var splitPath = copyPath.split('/');
    var imageName = splitPath[splitPath.length - 1];
    var filePath = ImagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(base64 => {
      this.croppedImagepath = base64;
      this.isLoading = false;
    }, error => {
      alert('Error in showing image' + error);
      this.isLoading = false;
    });
  }

}
