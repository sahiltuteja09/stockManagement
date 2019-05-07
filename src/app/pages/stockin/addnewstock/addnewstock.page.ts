import { Component, OnInit } from '@angular/core';
interface Stock {
  unique_id: number;
  product_name: string;
  }
@Component({
  selector: 'app-addnewstock',
  templateUrl: './addnewstock.page.html',
  styleUrls: ['./addnewstock.page.scss'],
})
export class AddnewstockPage implements OnInit {
  stock: Stock = <Stock>{};
  constructor() { }

  ngOnInit() {
  }

}
