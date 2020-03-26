import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ImagesService } from 'src/app/providers/upload/images.service';
import { ScannerService } from 'src/app/providers/scanner.service';
import { ActivatedRoute } from '@angular/router';
import { CoreConfigConstant } from 'src/configconstants';
import { ActionSheetController } from '@ionic/angular';
import { AuthenticationService } from '../../auth/authentication.service';
import { SpeakToSearchService } from 'src/app/providers/speech/speak-to-search.service';

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
  image: string;
  product_placed:string
}

@Component({
  selector: 'app-addnewstock',
  templateUrl: './addnewstock.page.html',
  styleUrls: ['./addnewstock.page.scss'],
})
export class AddnewstockPage implements OnInit {
  stock: Stock = <Stock>{};

  @ViewChild('productUnique') productUnique : string;

  isLoading: boolean = false;
  croppedImagepath: string = '';
  imageName: string = '';
  isLoadingSubscriber;
  croppedImagepathSubscriber;
  public newstockdetail: FormGroup;

  isMobileDevice: boolean = true;
  scannerbarCode;

  routSub: any;
  product_id: number = 0;
  scanType:string = '';
  img_base: string = CoreConfigConstant.uploadedPath;
  selectedFile: File[];

  quickUpdateObject:any = { 'color': 'danger', 'disabled':false };
  constructor(
    private scanService: ScannerService,
    public formBuilder: FormBuilder,
    private appProvider: CoreAppProvider,
    private curdService: CurdService,
    private uploadImage: ImagesService,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController, 
    public authenticationService: AuthenticationService, public voiceService:SpeakToSearchService) { 
      
    const currentUser = this.authenticationService.currentUserValue;
        const imgUserID = currentUser.id;
        this.img_base = this.img_base + imgUserID + 'assets/';

    this.stock = {
      'product_unique': '',
      'product_name': '',
      'other_uid': '',
      'amazon': '',
      'description': '',
      'flipkart': '',
      'paytm': '',
      'product_qty': 0,
      'purchase_cost': 0,
      'image': '',
      'product_placed': ''
    }
    this.stock.image = '';
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
      image: [this.imageName],
      product_placed:['']
    });

    this.routSub = this.route.params.subscribe((params) => {
      this.product_id = +params['product_id'];

    });
    
  }
  ionViewWillEnter() {
    this.isMobileDevice = this.appProvider.isMobile();
  }
  ngOnInit() {

    if (this.product_id > 0) {
      this.getProductDetail();
    }
  }
  getProductDetail() {

    this.appProvider.showLoading().then(loading => {
      loading.present().then(() => {
        let productId = { 'product_id': this.product_id };
        this.curdService.getData('getProduct', productId)
          .subscribe((data: any) => {

            if (data.status) {

              this.stock = {
                'product_unique': data.ids.app_unique,
                'product_name': data.data.title,
                'other_uid': data.ids.other_uid,
                'amazon': data.ids.amazon,
                'description': data.data.description,
                'flipkart': data.ids.flipkart,
                'paytm': data.ids.paytm,
                'product_qty': data.data.quantity,
                'purchase_cost': data.data.purchase_cost,
                'image': data.data.image,
                'product_placed': data.data.product_placed
              }
              if(data.data.image)
                this.croppedImagepath = this.img_base + data.data.image;

            } else {
              this.appProvider.showToast(data.msg);
            }
            // setTimeout(() => {
            //   this.appProvider.dismissLoading();
            // }, 2000);
            this.appProvider.dismissLoading();
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
  // get the form contorls in a f object
  get f() { return this.newstockdetail.controls; }
  newStock() {

    if (!this.newstockdetail.valid) {
      console.log('form');
      return;
    }
    else {

      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          let apiMethod = 'save_product';
          let merged;
          let updateStock;
          if (this.product_id > 0) {
            apiMethod = 'update_product';
            updateStock = { 'id': this.product_id };
          }else{
            updateStock = { 'id': 0};
          }
          merged = { ...updateStock, ...this.stock };

          this.curdService.postData(apiMethod, merged)
            .subscribe((data: any) => {

              if (data.status) {
                this.appProvider.showToast(data.data);
                this.newstockdetail.reset();
                
                
              } else {
                this.appProvider.showToast(data.msg);
              }
              setTimeout(() => {
                
                this.appProvider.dismissLoading();
                if (data.status)
                this.appProvider.goto('myproducts', 1);
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
  imageSelector(type?:string) {
    if(type== 'camera')
      this.uploadImage.captureImage();
      else
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
        
        this.imageName = this.uploadImage.imageFileName();
        if (this.imageName) {
          this.croppedImagepath = data;
          this.stock.image = this.imageName;
          console.log('this.imageName if ' + this.imageName);
          
        }
        if (typeof this.croppedImagepathSubscriber == 'object'){
          this.isLoading = false;
          this.croppedImagepathSubscriber.unsubscribe();
          this.isLoadingSubscriber.unsubscribe();
          this.croppedImagepathSubscriber = '';
          this.isLoadingSubscriber = '';
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
      this.stock.image =  data.status.data.file_name;
      this.croppedImagepath = this.img_base+this.stock.image;
    }
  }).catch((err) => {
    console.error(err)
  }
  );
}


scanCode(codeType){
  if (!this.appProvider.isMobile()) { return false; }

this.scanType =  codeType;
    if (typeof this.scannerbarCode != 'object') {
      this.scannerbarCode = this.scanService.barCodeText.subscribe((data) => {
        console.log(data);
        if(data.status){
          console.log(this.scanType);
      switch (this.scanType) {
            case 'product_unique':
             this.stock.product_unique = data.msg;
             //self.productUnique = data;
              break;
            case 'amazon_asin':
              this.stock.amazon = data.msg;
              break;
            case 'flipkart_asin':
              this.stock.flipkart = data.msg;
              break;
            case 'paytm_asin':
              this.stock.paytm = data.msg;
              break;
            case 'other_uid':
              this.stock.other_uid = data.msg;
              break;
          }
          
        }else{
          if(data.msg != ''){
            this.appProvider.showToast(data.msg);
          }
        }

      });
    }

    this.scanService.scanBarCode();

}
voiceToAdd:boolean = false;
startListing(){
if(this.voiceToAdd){
return;
}
  this.voiceToAdd = true;
  console.log('startListing');
  
  this.voiceService.txtToSpeech('Hey. I will assist you to adding the product. Just answer my some question.').then(()=>{

    this.voiceService.txtToSpeech('Can i ask? Speak yes or no after the beep').then(()=>{
        this.quickUpdateObject = { 'color': 'success', 'disabled':true };
      this.voiceService.startListing().then(() => {
       
          this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
        
        if(this.voiceService.speechTxt == 'yes'){

          this.voiceService.txtToSpeech('What is the product name? Speak after the beep').then(()=>{
           
              this.quickUpdateObject = { 'color': 'success', 'disabled':true };
            
            this.voiceService.startListing().then(() => {
              this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
              this.stock.product_name = this.voiceService.speechTxt;
      
              this.voiceService.txtToSpeech('What is the product unique id or sku? Speak after the beep').then(()=>{
                
                  this.quickUpdateObject = { 'color': 'success', 'disabled':true };
                
                this.voiceService.startListing().then(() => {
                  this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
                  this.stock.product_unique = this.voiceService.speechTxt;
      
                  this.voiceService.txtToSpeech('What is the product sale price? Speak after the beep').then(()=>{
                    
                      this.quickUpdateObject = { 'color': 'success', 'disabled':true };
                    
                    this.voiceService.startListing().then(() => {
                       this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
                      this.stock.purchase_cost = this.voiceService.speechTxt;
      
                      this.voiceService.txtToSpeech('What is available quantity? Speak after the beep').then(()=>{
                      
                          this.quickUpdateObject = { 'color': 'success', 'disabled':true };
                        
                        this.voiceService.startListing().then(() => {
                          this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
                          this.stock.product_qty = this.voiceService.speechTxt;
      
                          this.voiceService.txtToSpeech('Thank you. can i add the product in your inventory? Speak yes or no after the beep').then(()=>{
                           
                              this.quickUpdateObject = { 'color': 'success', 'disabled':true };
                            
                            this.voiceService.startListing().then(() => {
                              
                              if(this.voiceService.speechTxt == 'yes'){
                                if(this.stock.image == '')
                                this.voiceService.txtToSpeech('I suggest, please add the product image. For now i am adding the product to your inventory.');
                                else
                                this.voiceService.txtToSpeech('I am adding the product to your inventory.');
                                 this.newStock();
                                 this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
                              }else{
                                this.voiceService.txtToSpeech('Thank you. Please add product manually.');
                              }
      
                            }).catch((err) => {
                              this.voiceToAdd = false;
                              this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
                              this.voiceService.txtToSpeech('Sorry, Unable to understand. Please try again')
                            });
                          });
      
                        }).catch((err) => {
                          this.voiceToAdd = false;
                          this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
                          this.voiceService.txtToSpeech('Sorry, Unable to understand. Please try again')
                        });
                      });
      
                    }).catch((err) => {
                      this.voiceToAdd = false;
                      this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
                      this.voiceService.txtToSpeech('Sorry, Unable to understand. Please try again')
                    });
                  });
      
                }).catch((err) => {
                  this.voiceToAdd = false;
                  this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
                  this.voiceService.txtToSpeech('Sorry, Unable to understand. Please try again')
                });
              });
      
            }).catch((err) => {
              this.voiceToAdd = false;
              this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
              this.voiceService.txtToSpeech('Sorry, Unable to understand. Please try again')
            });
          });

        }else{
          this.voiceToAdd = false;
          this.voiceService.txtToSpeech('Thank you. Please add product manually.');
        }

      }).catch((err) => {
        this.voiceToAdd = false;
        this.quickUpdateObject = { 'color': 'danger', 'disabled':false };
        this.voiceService.txtToSpeech('Sorry, Unable to understand. Please try again')
      });
    });
});
}

  ionViewWillLeave() {
    if (typeof this.isLoadingSubscriber == 'object')
      this.isLoadingSubscriber.unsubscribe();

    if (typeof this.croppedImagepathSubscriber == 'object')
      this.croppedImagepathSubscriber.unsubscribe();

    if (typeof this.routSub == 'object')
      this.routSub.unsubscribe();
   
      if (typeof this.scannerbarCode == 'object') {
        this.scanService.emptyText();
        this.scannerbarCode.unsubscribe();
        
      }

        this.appProvider.dismissLoading();

        this.croppedImagepathSubscriber = '';
          this.isLoadingSubscriber = '';
  }

}
