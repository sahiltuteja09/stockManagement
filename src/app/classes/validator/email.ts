import { FormControl } from '@angular/forms';

export class EmailValidator {

    static checkEmail(control: FormControl): any {

        return new Promise(resolve => {

            //Fake a slow response from server
            let email = control.value;
console.log(email);
            setTimeout(() => {
                if (email.toLowerCase() === "sahiltuteja09@gmail.com") {
                    console.log('email');
                    resolve(null);
                    
            
                    } else {
                        resolve({
                            "username taken": true
                          });
                    }
            }, 2000);

        });
    }

}