import { Component, OnInit, Input } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  isVisible:boolean = false;
  @Input('modal-name') name: string;



  constructor(private modalService: ModalService) {
  }

  ngOnInit() {
    this.modalService.register(this.name, this);
  }

  toggleVisible() {
    this.isVisible = !this.isVisible;
  }

}
