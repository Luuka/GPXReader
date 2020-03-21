import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { StorageService } from '../storage.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private editorService: EditorService, private storageService: StorageService, private router: Router) { }

  ngOnInit() {
  }

  ondragover(evt) {
    evt.target.classList.add('uploadfilecontainer-dragover');
    this.disablebehavior(evt);
  }

  ondragleave(evt) {
    evt.target.classList.remove('uploadfilecontainer-dragover');
    this.disablebehavior(evt);
  }

  disablebehavior(evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }

  uploadFile(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;

    for (const file of files) {
      this.readFile(file);
    }
  }

  uploadFileFromInput(files) {
    for(let file of files) {
      this.readFile(file);
    }
  }

  readFile(file) {
    const home = this;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      home.editorService.loadGpx(text);
      home.router.navigateByUrl('/editor');
    };
    reader.readAsText(file);
  }

  loadSession() {
    this.editorService.loadGEOJSON(this.storageService.getDataStored());
    this.router.navigateByUrl('/editor');
  }
}
