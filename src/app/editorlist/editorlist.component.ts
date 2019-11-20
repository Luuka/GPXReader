import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { from, Subscription } from 'rxjs';

@Component({
  selector: 'app-editorlist',
  templateUrl: './editorlist.component.html',
  styleUrls: ['./editorlist.component.scss']
})
export class EditorlistComponent implements OnInit {

  constructor(private editorService: EditorService) { }

  private tracksObs: Subscription;
  private tracks = [];

  ngOnInit() {
    let keepThis = this;
    this.tracksObs = this.editorService.tracksObs.subscribe(
      tracks => {
        keepThis.tracks = tracks;
      }
    );

  }

  onCheckChange(e) {
    let idx = e.target.getAttribute('data-id');
    (this.tracks as any).features[idx].properties.visible = e.target.checked;
    this.editorService.postTracks(this.tracks);
  }

  toggleAccordion(id,e) {
    let accordion = document.getElementById(id);
    accordion.classList.toggle('accordion--open');
    
    let chevron = document.getElementById('accordion-chevron--'+id);
    chevron.classList.toggle('fa-chevron-up');
    chevron.classList.toggle('fa-chevron-down');
  }

  ngOnDestroy(){
    this.tracksObs.unsubscribe();
  }
}
