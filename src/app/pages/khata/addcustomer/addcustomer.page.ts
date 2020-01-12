import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoreAppProvider } from 'src/app/providers/app';
import { CurdService } from 'src/app/services/rest/curd.service';

@Component({
  selector: 'app-addcustomer',
  templateUrl: './addcustomer.page.html',
  styleUrls: ['./addcustomer.page.scss'],
})
export class AddcustomerPage implements OnInit {
  public addcustomer: FormGroup;
  customer:any;
  constructor(public formBuilder: FormBuilder,private appProvider: CoreAppProvider, private curdService: CurdService) { 
    this.customer = {
      name : '',
      mobile_number: ''
    }
    this.addcustomer = formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      mobile_number: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
    });
  }

  ngOnInit() {
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
          'amount_paid':'0',
          'amount_received':'0',
          'description':'',
          'purchase_id':0,
          'purchase_date': '',
        };
        let merged = {...this.customer, ...emptyfields };
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
}
