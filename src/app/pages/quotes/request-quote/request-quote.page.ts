import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-quote',
  templateUrl: './request-quote.page.html',
  styleUrls: ['./request-quote.page.scss'],
})
export class RequestQuotePage implements OnInit {
  comment:any = '';
   constructor() { }

  ngOnInit() {
  }
  sendQuery(){
    console.log(this.comment);
  }

}
