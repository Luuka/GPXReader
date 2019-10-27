import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  disablebehavior(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  uploadFile(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files
    console.log(files);
  }

  uploadFileFromInput(evt) {
    console.log(evt);
  }

}
