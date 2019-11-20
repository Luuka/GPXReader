import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { from, Subscription } from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor(private editorService: EditorService, private router: Router) { }

  private tracksObs: Subscription;

  ngOnInit() {

    this.tracksObs = this.editorService.tracksObs.subscribe(
      tracks => {
        if(tracks.features.length == 0) {
          this.router.navigateByUrl('/');
        }
      }
    );

  }

}
