import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { from, Subscription } from 'rxjs';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-editorlist',
  templateUrl: './editorlist.component.html',
  styleUrls: ['./editorlist.component.scss']
})
export class EditorlistComponent implements OnInit {

  constructor(private editorService: EditorService, private modalService: ModalService) { }

  private tracksObs: Subscription;
  private tracks = [];

  private currentTrackItem = null;

  private currentEditTrack = null;
  private currentEditTrackIdx = null;

  ngOnInit() {
    const editorComponent = this;
    this.tracksObs = this.editorService.tracksObs.subscribe(
      tracks => {
        editorComponent.tracks = tracks;
      }
    );
  }

  onCheckChange(e) {
    const idx = e.target.getAttribute('data-id');
    (this.tracks as any).features[idx].properties.visible = e.target.checked;
    this.editorService.postTracks(this.tracks);
  }

  toggleAccordion(id, e) {
    const accordion = document.getElementById(id);
    accordion.classList.toggle('accordion--open');

    const chevron = document.getElementById('accordion-chevron--' + id);
    chevron.classList.toggle('fa-chevron-up');
    chevron.classList.toggle('fa-chevron-down');
  }

  toggleItemMenu(id) {
    if (this.currentTrackItem !== id) {
      this.currentTrackItem = id;
    } else {
      this.currentTrackItem = null;
    }
  }

  deleteElement(idx) {
    this.editorService.removeFeature(idx);
  }

  startEditTrack(idx) {
    this.currentEditTrackIdx = idx;
    this.currentEditTrack = this.tracks.features[idx];
    this.modalService.get('modal-test').toggleVisible();
  }

  saveEditTrack() {
    this.tracks.features[this.currentEditTrackIdx] = this.currentEditTrack;
    this.editorService.postTracks(this.tracks);

    this.modalService.get('modal-test').toggleVisible();
    this.currentEditTrack = null;
    this.currentEditTrackIdx = null;
  }

  ngOnDestroy(){
    this.tracksObs.unsubscribe();
  }
}
