import { Injectable } from '@angular/core';
import { Contacts } from '@ionic-native/contacts/ngx';
@Injectable({
  providedIn: 'root'
})
export class NativeContactService {
  contactInfo:any;
  constructor(private contacts: Contacts) { }

  get contactDetail(){
   return this.contactInfo;
  }

  pickContact():Promise<any>{
    return new Promise( (resolve, reject) => {

      this.contacts.pickContact().then((data)=>{
        console.log(data);
        let customername = '';
        if(data.displayName){
          customername = data.displayName;
        }
         if(name == '' && data.nickname){
          customername = data.nickname;
        }
        this.contactInfo = {
          name:customername,
          mobile: data.phoneNumbers[0].value
        }
        resolve();
      }).catch((error)=> {
        reject();
      });

    });
    
  }
}
