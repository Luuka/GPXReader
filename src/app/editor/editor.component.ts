import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { StorageService } from '../storage.service';
import { from, Subscription } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor(private editorService: EditorService, private storageService: StorageService, private router: Router) { }

  private tracksObs: Subscription;

  ngOnInit() {

    this.tracksObs = this.editorService.tracksObs.subscribe(
      tracks => {
        if (tracks.features.length === 0) {

          if (this.storageService.isDataStored()) {
            this.editorService.loadGEOJSON(this.storageService.getDataStored());
          } else {
            this.router.navigateByUrl('/');
          }
        } else {
          this.storageService.updateStorage(tracks);
        }
      }
    );

  }

}
