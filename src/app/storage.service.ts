import { Injectable } from '@angular/core';
import {Browser} from 'leaflet';
import win = Browser.win;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  static JSONDATAKEY = 'JSONData';

  private localStorage: Storage;

  constructor() {
    this.localStorage = window.localStorage;
  }

  updateStorage(data) {
    this.localStorage.setItem(StorageService.JSONDATAKEY, JSON.stringify(data));
  }

  getDataStored() {
    return JSON.parse(this.localStorage.getItem(StorageService.JSONDATAKEY));
  }

  isDataStored(): boolean {
    return this.localStorage.getItem(StorageService.JSONDATAKEY) !== null;
  }
}
