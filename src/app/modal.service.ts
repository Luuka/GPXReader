import { Injectable } from '@angular/core';
import { ModalComponent } from './modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modals: ModalComponent[];

  constructor() {
    this.modals = [];
  }

  register(name, component) {
    this.modals[name] = component;
  }

  get(name) {
    return this.modals[name];
  }

}
