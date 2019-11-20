import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private editorService: EditorService, private router: Router) { }

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
    let files = evt.dataTransfer.files
    
    for(let file of files) {
      this.readFile(file);
    }
  }

  uploadFileFromInput(files) {
    for(let file of files) {
      this.readFile(file);
    }
  }

  readFile(file) {
    let keepThis = this;

    let reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
      keepThis.editorService.loadGpx(text);
      keepThis.router.navigateByUrl('/editor');
    };
    reader.readAsText(file);
  }

}
