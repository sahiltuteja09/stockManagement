import { Component, OnInit } from '@angular/core';
import {  FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registerDetails: FormGroup;
  constructor(public formBuilder: FormBuilder) {

    this.registerDetails = formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(3), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      mobile: ['', Validators.compose([Validators.minLength(10), Validators.pattern('[0-9 ]*'), Validators.required])],
      email:[''],
      password:['']
  });
   }

  ngOnInit() {
  }
  register(){
    if(!this.registerDetails.valid){console.log('form');}

  }
}
