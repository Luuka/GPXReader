import { Injectable } from '@angular/core';
import * as togeojson from '@mapbox/togeojson';
import { from, Subject, BehaviorSubject } from 'rxjs';
declare const gpxParser: any;

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private tracks   = new BehaviorSubject<any>({type: 'FeatureCollection', features: []});
  public tracksObs = this.tracks.asObservable();

  private currentEditable   = new BehaviorSubject<number>(null);
  public currentEditableObs = this.currentEditable.asObservable();

  constructor() {
  }

  loadGpx(content) {
    const gpxDOM = new DOMParser().parseFromString(content, 'text/xml');
    const geoJSON = togeojson.gpx(gpxDOM);
    this.loadGEOJSON(geoJSON);
  }

  loadGEOJSON(geoJSON) {
    const storedGeoJSON: any = this.tracks.value;
    storedGeoJSON.features = storedGeoJSON.features.concat(geoJSON.features);

    for (const idx in storedGeoJSON.features) {
      storedGeoJSON.features[idx].properties.distance  = this.calcDistance(storedGeoJSON.features[idx].geometry.coordinates);
      storedGeoJSON.features[idx].properties.elevation = this.calcElevation(storedGeoJSON.features[idx].geometry.coordinates);
      storedGeoJSON.features[idx].properties.visible   = true;

      if (storedGeoJSON.features[idx].properties.color == undefined) {
        const color = this.pickRandomColor();
        storedGeoJSON.features[idx].properties.color = color;
      }
    }

    this.tracks.next(storedGeoJSON);
  }

  startEdit(id) {
    if (id === this.currentEditable.getValue()) {
      this.stopEdit();
    } else {
      if (this.tracks.value.features[id].properties.visible) {
        this.currentEditable.next(id);
      }
    }
  }

  stopEdit() {
    this.currentEditable.next(null);
  }

  postTracks(tracks) {
    for (const idx in tracks.features) {
      tracks.features[idx].properties.distance  = this.calcDistance(tracks.features[idx].geometry.coordinates);
      tracks.features[idx].properties.elevation = this.calcElevation(tracks.features[idx].geometry.coordinates);
    }
    this.tracks.next(tracks);
  }

  pickRandomColor() {
    const h = 1 + Math.random() * (1 - 360);
    const s = 50;
    const l = 50;
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  }

  calcDistance(coordinates: Array<Array<number>>): number {
    let distance = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      distance += this.calcDistanceBetween(coordinates[i], coordinates[i + 1]);
    }

    return Math.round(distance / 1000);
  }

  calcDistanceBetween(wpt1: Array<number>, wpt2: Array<number>): number {
    const latlng1: any = {};
    latlng1.lat = wpt1[0];
    latlng1.lon = wpt1[1];

    const latlng2: any = {};
    latlng2.lat = wpt2[0];
    latlng2.lon = wpt2[1];

    const rad = Math.PI / 180;
    const lat1 = latlng1.lat * rad;
    const lat2 = latlng2.lat * rad;
    const sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2);
    const sinDLon = Math.sin((latlng2.lon - latlng1.lon) * rad / 2);
    const a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return 6371000 * c;
  }

  calcElevation(coordinates: Array<Array<number>>) {
    let positive = 0;
    let negative = 0;
    const ret: any = {};

    for (let i = 0; i < coordinates.length - 1; i++) {
        const diff = coordinates[i + 1][2] - coordinates[i][2];

        if (diff < 0) {
          negative += diff;
        } else if (diff > 0) {
          positive += diff;
        }
    }

    ret.positive = Math.round(Math.abs(positive)) || null;
    ret.negative = Math.round(Math.abs(negative)) || null;

    return ret;
  }

  removeFeature(idx) {
    const storedGeoJSON: any = this.tracks.value;

    storedGeoJSON.features.splice(idx,1);

    this.tracks.next(storedGeoJSON);
  }
}
