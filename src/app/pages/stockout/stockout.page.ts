import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';
import { ActivatedRoute } from '@angular/router';
import { ScannerService } from 'src/app/providers/scanner.service';
import { CoreConfigConstant } from 'src/configconstants';
import { AuthenticationService } from '../auth/authentication.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { SpeakToSearchService } from 'src/app/providers/speech/speak-to-search.service';
@Component({
  selector: 'app-stockout',
  templateUrl: './stockout.page.html',
  styleUrls: ['./stockout.page.scss'],
  animations: [
    trigger('panelInOut', [
        transition('void => *', [
            style({transform: 'translateY(-100%)'}),
            animate(800)
        ]),
        // transition('* => void', [
        //     animate(100, style({transform: 'translateY(100%)'}))
        // ])
    ]),
]
})
export class StockoutPage implements OnInit {
  searchTerm: string = "";
  searching: boolean = false;
  searchControl: FormControl;
  searchApi: string = 'searchByKeyword';
  page: number = 1;
  searchData: any = [];
  noDataFound: string = 'Please enter the keyword or scan qr to search.';

  stock: any;
  stockStatus: any = [];
  isStockStatusFetched: boolean = false;

  merchants: any = [];
  isMerchantFetched: boolean = false;
  public updatestockdetail: FormGroup;

  queryParmSub: any;

  isMobileDevice: boolean = true;
  defaultImage:string = 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
  img_base: string = CoreConfigConstant.uploadedPath;

  scannerbarCode;
  availableQuantity:number = 0;
  product_image:string = '';
  inFiniteLoop:boolean = false;
  products:any = [];
  
  defaultSelecteType= '6';
  compareWithType : any ;
  defaultSelecteMerchant = '1';
  compareWithMerchant : any ;
  purchaseCost:number = 0;
  selectedProductId:number = 0;
  hideProductCard:boolean =true;
  selectedProductTitle:string ='';
  public sform: FormGroup;
  speechProduct:any = {};
  quickUpdate:boolean = false;
  quickUpdateObject:any = {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
  speakToSearch:boolean = false;
  isSafariBrowser:boolean = false;
  constructor(
    private scanService: ScannerService,
    private curdService: CurdService,
    private appProvider: CoreAppProvider,
    private route: ActivatedRoute, 
    public authenticationService: AuthenticationService,
    public voiceService:SpeakToSearchService
    ) { 
      
    const currentUser = this.authenticationService.currentUserValue;
        const imgUserID = currentUser.id;
        this.img_base = this.img_base + imgUserID + 'assets/';
    this.searchControl = new FormControl();
    this.updatestockdetail = new FormGroup({
      quantity: new FormControl(),
      product_status_id: new FormControl(),
      marketplace_id: new FormControl(),
      product_id: new FormControl(),
      sale_price: new FormControl(),
    });

    this.sform = new FormGroup({
      searchControl: new FormControl()
    });
    
    this.getStockType();
    this.getMerchants();
    this.compareWithType = this.compareWithFn;
    this.compareWithMerchant = this.compareWithMerchantFn;
this.isSafariBrowser = this.appProvider.isSafari();
    
  }
  
  compareWithFn(o1, o2) {
    return o1 === o2;
  }
  compareWithMerchantFn(o1, o2) {
    return o1 === o2;
  }
  
  ionViewWillEnter() {
    this.queryParmSub = this.route.queryParams.subscribe(params => {
      this.searchTerm = params['term'];
      console.log('ionViewWillEnter '+this.searchTerm);
    });
    this.isMobileDevice = this.appProvider.isMobile();
    if(typeof this.searchTerm == 'undefined')
    this.getProductsList();
  }
  ngOnInit() {
    this.searchControl.valueChanges.pipe(debounceTime(2000)).subscribe(value => { this.searching = false; this.searchProduct() });
  }
  quickUpdateProduct(){
    this.quickUpdate = true;
    this.startListing('Please Speak after the beep.');
    
  }

  startListing(msg?:string){
    if(this.speakToSearch){return false;}
    if(!msg)
    msg = 'Hey. I will try to search whatever you speak.Please Speak after the beep.';
    this.speakToSearch = true;
    this.voiceService.txtToSpeech(msg).then(()=>{
        this.quickUpdateObject = {'txt':"Hey!! I am Listing...", 'color': 'success', 'disabled':true };
    this.voiceService.startListing().then(() => {
      if(this.voiceService.speechTxt == this.searchTerm){
        this.speakToSearch =false;
             }
       this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
      this.sform.controls["searchControl"].setValue(this.voiceService.speechTxt);
    }).catch((err) => {
        this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
        this.speakToSearch =false;
      console.log(err);
    });
  });
  }

  updatePriceField(quantity, productId, product_status_id, marketplace_id, reason, noUIDFOUND?:number,sale_price?:any){
    if(this.speakToSearch){return false;}
    this.speakToSearch = true;
    this.speechProduct = {
      'quantity':quantity,
      productId:productId,
      product_status_id:product_status_id,
      marketplace_id:marketplace_id,
      reason:reason,
      noUIDFOUND:noUIDFOUND,
      sale_price:sale_price
    }
    this.voiceService.txtToSpeech('What is the new price ?Speak after the beep').then(()=>{
    
        this.quickUpdateObject = {'txt':"Hey!! I am Listing...", 'color': 'success', 'disabled':true };
      
      this.voiceService.startListing().then(() => {
        // validation required
      
          this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
            eval('document.getElementById("'+ productId +'").value = '+this.voiceService.speechTxt);
        this.speechProduct.sale_price = this.voiceService.speechTxt;
        this.updateProductAuto();

            }).catch((err) => {
              
                this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
                this.speakToSearch =false;
              this.voiceService.txtToSpeech('Price field should be numeric. still want to update price. Speak yes or no after the beep ').then(()=>{
                this.updateSpeechPrice(productId, 1);
              });
            });
    });
  }
  updateQuantityField(quantity, productId, product_status_id, marketplace_id, reason, noUIDFOUND?:number,sale_price?:any){
    if(this.speakToSearch){return false;}
    this.speakToSearch = true;
    this.speechProduct = {
      'quantity':quantity,
      productId:productId,
      product_status_id:product_status_id,
      marketplace_id:marketplace_id,
      reason:reason,
      noUIDFOUND:noUIDFOUND,
      sale_price:sale_price
    }
    this.voiceService.txtToSpeech('What is the new quantity. Speak after the beep').then(()=>{
    
        this.quickUpdateObject = {'txt':"Hey!! I am Listing...", 'color': 'success', 'disabled':true };
    
      this.voiceService.startListing().then(() => {
        // validation required
        
          this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
          
          eval('document.getElementById("quantity'+ productId +'").value = '+this.voiceService.speechTxt);
          this.speechProduct.quantity = this.voiceService.speechTxt;
          this.voiceService.txtToSpeech('New quantity is '+this.voiceService.speechTxt +'.');
          this.updateProductAuto();
        }).catch((err) => {
          this.speakToSearch =false;
            this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
            
          this.voiceService.txtToSpeech('Quantity field should be numeric. Still want to update quantity. Speak yes or no after the beep ').then(()=>{
            this.updateSpeechQuantity(productId);
          });
        });
    });
  }
  updateFields(quantity, productId, product_status_id, marketplace_id, reason, noUIDFOUND?:number,sale_price?:any){
    if(this.speakToSearch){return;}
    this.speakToSearch = true;
    this.speechProduct = {
      'quantity':quantity,
      productId:productId,
      product_status_id:product_status_id,
      marketplace_id:marketplace_id,
      reason:reason,
      noUIDFOUND:noUIDFOUND,
      sale_price:sale_price
    }
      this.voiceService.txtToSpeech('Product price is rupees '+sale_price+' Do you want to update?Please Speak Yes or No after the beep.').then(()=>{
        this.updateSpeechPrice(productId,0);
    });
  }
  updateSpeechPrice(productId, isField?:number){

  
      this.quickUpdateObject = {'txt':"Hey!! I am Listing...", 'color': 'success', 'disabled':true };
    
    this.voiceService.startListing().then(() => {
      
        this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
        
      if(this.voiceService.speechTxt == 'yes'){
        
        this.voiceService.txtToSpeech('What is the new price ?Speak after the beep').then(()=>{
         
            this.quickUpdateObject = {'txt':"Hey!! I am Listing...", 'color': 'success', 'disabled':true };
          
          this.voiceService.startListing().then(() => {
            // validation required
            
              this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
              
            eval('document.getElementById("'+ productId +'").value = '+this.voiceService.speechTxt);
            this.speechProduct.sale_price = this.voiceService.speechTxt;
            this.voiceService.txtToSpeech('New Price is rupees '+this.voiceService.speechTxt +'.Do you want to update quantity.Speak Yes or No after the beep').then(()=>{
              this.updateSpeechQuantity(productId);
            });
    
                }).catch((err) => {
                  this.speakToSearch =false;
                    this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
                    
                  this.voiceService.txtToSpeech('Price field should be numeric. still want to update price. Speak yes or no after the beep ').then(()=>{
                    this.updateSpeechPrice(productId,0);
                  });
                });
        });
      }else if(this.voiceService.speechTxt == 'stop'){
        this.speakToSearch =false;
        this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
      }else{
        if(isField){
          this.updateProductAuto();
        }else{
        this.voiceService.txtToSpeech('Do you want to update quantity.Speak Yes or No after the beep').then(()=>{
          this.updateSpeechQuantity(productId);
        }).catch(()=>{
          console.log('Do you want to update quantity.Speak Yes or No after the beep');
        })
      }
      }

    }).catch((err) => {
      this.speakToSearch =false;
        this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
        
    });
  }
  updateSpeechQuantity(productId){
   
      this.quickUpdateObject = {'txt':"Hey!! I am Listing...", 'color': 'success', 'disabled':true };
    
    this.voiceService.startListing().then(() => {
      
        this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
        
      if(this.voiceService.speechTxt == 'yes'){

        this.voiceService.txtToSpeech('What is the new quantity. Speak after the beep').then(()=>{
      
            this.quickUpdateObject = {'txt':"Hey!! I am Listing...", 'color': 'success', 'disabled':true };
          
          this.voiceService.startListing().then(() => {
            // validation required
            
              this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
              
              eval('document.getElementById("quantity'+ productId +'").value = '+this.voiceService.speechTxt);
              this.speechProduct.quantity = this.voiceService.speechTxt;
              this.voiceService.txtToSpeech('New quantity is '+this.voiceService.speechTxt +'.');
              this.updateProductAuto();
            }).catch((err) => {
              this.speakToSearch =false;
                this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
                
              this.voiceService.txtToSpeech('Quantity field should be numeric. Still want to update quantity. Speak yes or no after the beep ').then(()=>{
                this.updateSpeechQuantity(productId);
              });
            });
        });
      }else if(this.voiceService.speechTxt == 'stop'){
        this.speakToSearch =false;
        this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
      }else{
       
        this.updateProductAuto();
      }
    }).catch((err) => {
      this.speakToSearch =false;
        this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
        
    }); 
  }

  updateProductAuto(updatewithouspeak?:any){
    if(updatewithouspeak == 1){
      this.voiceService.txtToSpeech('Product found. Updating...');
      this.updateStock(this.speechProduct.quantity,this.speechProduct.productId,this.speechProduct.product_status_id,this.speechProduct.marketplace_id,this.speechProduct.reason,this.speechProduct.noUIDFOUND,this.speechProduct.sale_price);
    }else{
      this.voiceService.txtToSpeech('Can i update the product?Speak yes or no after the beep').then(()=>{
        
          this.quickUpdateObject = {'txt':"Hey!! I am Listing...", 'color': 'success', 'disabled':true };
        
        this.voiceService.startListing().then(() => {
         
            this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
            
          if(this.voiceService.speechTxt == 'yes'){
            this.voiceService.txtToSpeech('Updating your product.');
            this.updateStock(this.speechProduct.quantity,this.speechProduct.productId,this.speechProduct.product_status_id,this.speechProduct.marketplace_id,this.speechProduct.reason,this.speechProduct.noUIDFOUND,this.speechProduct.sale_price);
          }else{
            this.speakToSearch = false;
            this.voiceService.txtToSpeech('Thank you.');
          }
        }).catch(() => {
          this.speakToSearch =false;
            this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
            
        });
  
      });
    }
    
  }
  

  setFilteredItems() {
    this.searching = true;
   this.resetProductView();
  }
  searchProduct() {
    if (this.searchTerm) {
      this.voiceService.txtToSpeech('searching... Please wait...');
      this.inFiniteLoop = false;
      this.page = 1;
      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          if (!this.isStockStatusFetched) {
            this.getStockType();
          }
          if (!this.isStockStatusFetched) {
            this.getMerchants();
          }
          
          let param = { 'page': this.page, 'term': this.searchTerm };
          this.curdService.getData(this.searchApi, param)
            .subscribe((data: any) => {
              if (data.status == false) {
                // no product found
                this.noDataFound = data.msg;
                this.searchData = [];
                if(Object.keys(this.products).length === 0){
                  this.getProductsList();
                }
                this.speakToSearch = false;
                this.voiceService.txtToSpeech(this.noDataFound);
              } else {
                this.searchData = data;
                this.page = this.page + 1;
                let totalProducts = Object.keys(data.data).length;
              
                if(this.speakToSearch){
                  this.speakToSearch = false;
               if(totalProducts == 1 ){//&& this.isMobileDevice
                    let productRow = data.data;
                    this.speechProduct = {
                      quantity: 1,
                      productId:productRow[0].id,
                      product_status_id:this.defaultSelecteType,
                      marketplace_id:this.defaultSelecteMerchant,
                      reason: '',
                      noUIDFOUND:0,
                      sale_price:productRow[0].purchase_cost
                    }
                    if(!this.quickUpdate){
                    this.voiceService.txtToSpeech('One product found.Can i update the product?Please Speak Yes or No after the beep.').then(()=>{
                      
                        this.quickUpdateObject = {'txt':"Hey!! I am Listing...", 'color': 'success', 'disabled':true };
                      
                      this.voiceService.startListing().then(() => {
                        
                          this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
                          
                      if(this.voiceService.speechTxt == 'yes'){
                      this.updateProductAuto(1);
                      }else if(this.voiceService.speechTxt == 'stop'){
                        this.speakToSearch =false;
                        this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
                      }else{
                        this.voiceService.txtToSpeech('Do you want to update price?Please Speak Yes or No after the beep.').then(()=>{
                          this.updateSpeechPrice(productRow[0].id,0);
                        });
                      }
                    }).catch((err) => {
                      this.speakToSearch =false;
                        this.quickUpdateObject= {'txt':"Quick Update", 'color': 'danger', 'disabled':false };
                        
                    }); 

                  });
                  }else{
                    this.quickUpdate = false;
                    // if(!this.isMobileDevice){
                    //   this.recognition.stop();
                    // }
                    this.updateProductAuto(1);
                  }
                }else{
                  this.voiceService.txtToSpeech(totalProducts +' products found. Please select product manually.');
                }
              }else{
                this.speakToSearch = false;
              }

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
    this.inFiniteLoop = true;
    this.noDataFound = '';
    setTimeout(() => {
      let param = { 'page': this.page, 'term': this.searchTerm };
      this.curdService.getData(this.searchApi, param)
        .subscribe(
          (result: any) => {
            if (result.status == false) {
              // no product found
              this.noDataFound = result.msg;
            } else {
              for (let i = 0; i < result.data.length; i++) {
                this.searchData.data.push(result.data[i]);
              }
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

  updateStock(quantity, productId, product_status_id, marketplace_id, reason, noUIDFOUND?:number,sale_price?:any) {

    if (quantity > 0) {
      if (product_status_id == '') {
        this.appProvider.showToast('Stock type is required.');
        return;
      }
      if(productId == '' || productId == undefined){
        this.appProvider.showToast('Invalid product!! Please select a product.');
        return;
      }

      let stock = {'save_to_product_uids': 0, 'quantity': quantity, 'id': productId, 'product_status_id': product_status_id, 'marketplace_id': marketplace_id, 'stockType': 2, 'reason': reason, 'sale_price':sale_price }

      if(noUIDFOUND == 1){
        if (marketplace_id == '') {
          this.appProvider.showToast('Please select the merchant.');
          return;
        }
        let product_uids_type = {'save_to_product_uids': 0, 'marketplace_unique_id' : ''}; 
        if(this.searchTerm){
         product_uids_type = {'save_to_product_uids': 1, 'marketplace_unique_id' : this.searchTerm}; 
        }
        stock = {...stock , ...product_uids_type};
      }
     
      this.appProvider.showLoading().then(loading => {
        loading.present().then(() => {
          this.curdService.postData('updateStock', stock)
            .subscribe((data: any) => {

              if (data.status) {
                this.voiceService.txtToSpeech('Product Updated successfully');
                this.appProvider.showToast(data.data);
                
                this.updatestockdetail.reset();
              } else {
                this.voiceService.txtToSpeech('Unable to update. Please click on the update button.');
                this.appProvider.showToast(data.msg);
                
              }
              setTimeout(() => {
                this.appProvider.dismissLoading();
                if (data.status){
                  if(typeof this.queryParmSub == 'object')
                      this.queryParmSub.unsubscribe();
                      
                      this.searchTerm = '';
                  this.appProvider.goto('myproducts',1);
                }
                
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
    } else {
      this.appProvider.showToast('Quantity field must be greater than zero.');
    }
  }

  getProductsList() {
    this.curdService.getData('myProductsList')
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            // no product found
            this.products = [];
          } else {
            this.products = data;
          }
        },
        error => {
        }
      );
  }

  getStockType() {
    this.curdService.getData('getProductStatus')
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            // no product found
            this.noDataFound = data.msg;
            this.isStockStatusFetched = false;
          } else {
            this.isStockStatusFetched = true;
            this.stockStatus = data;
          }
        },
        error => {
          this.isStockStatusFetched = false;
        }
      );
  }
  getMerchants() {
    this.curdService.getData('getMerchants')
      .subscribe(
        (data: any) => {
          if (data.status == false) {
            // no product found
            this.noDataFound = data.msg;
            this.isStockStatusFetched = false;
          } else {
            this.isStockStatusFetched = true;
            this.merchants = data;
          }
        },
        error => {
          this.isStockStatusFetched = false;
        }
      );
  }

  scanCode(){
    if (!this.appProvider.isMobile()) { return false; }

      if (typeof this.scannerbarCode != 'object') {
        this.scannerbarCode = this.scanService.barCodeText.subscribe((data) => {
          
          if(data.status){

            this.searchTerm = data.msg;
         this.searchProduct();
          }else{
            if(data.msg != ''){
              this.appProvider.showToast(data.msg);
            }
          }
  
        });
      }
      this.searchTerm = '';
      this.scanService.scanBarCode();
  
  }
  // setProductView(product:any){
  //   console.log(product);
  //   this.availableQuantity = product.detail.value.quantity;
  //   this.product_image = product.detail.value.image;
  //   this.purchaseCost = product.detail.value.purchase_cost;
  // }
  resetProductView(){
    this.availableQuantity =0;
    this.product_image = '';
    this.purchaseCost = 0;
  }
  ionViewWillLeave() {
    if(typeof this.queryParmSub == 'object')
      this.queryParmSub.unsubscribe();

      if (typeof this.scannerbarCode == 'object') {
        this.scanService.emptyText();
        this.scannerbarCode.unsubscribe();
        
      }
      this.searchTerm = '';
        this.appProvider.dismissLoading();
        console.log('ionViewWillLeave');
  }
  ngOnDestroy(){
    this.searchTerm = '';
    if(typeof this.queryParmSub == 'object')
      this.queryParmSub.unsubscribe();

      console.log('ngOnDestroy');
      // if(!this.isMobileDevice){
      //   this.recognition.stop();
      // }
  }
  selectedProduct(product:any){
this.selectedProductId = product.id;

this.availableQuantity = product.quantity;
    this.product_image = product.image;
    this.purchaseCost = product.purchase_cost;
this.selectedProductTitle = product.title;this.hideProductCard = false;
setTimeout(() => {
  
}, 200);
  }
  undoSelectedProduct(){
    this.hideProductCard = true;
    this.selectedProductId = 0;
  }
}
