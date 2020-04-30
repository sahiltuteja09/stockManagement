import { Component, OnInit } from '@angular/core';
import { CoreAppProvider } from 'src/app/providers/app';

@Component({
  selector: 'app-myquotes',
  templateUrl: './myquotes.page.html',
  styleUrls: ['./myquotes.page.scss'],
})
export class MyquotesPage implements OnInit {

  constructor(private appProvider: CoreAppProvider) { }

  ngOnInit() {
  }
  gotopage(page:string){
this.appProvider.goto(page);
  }
}
