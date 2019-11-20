import { Injectable } from '@angular/core';
import * as togeojson from '@mapbox/togeojson';
import { from, Subject, BehaviorSubject } from 'rxjs';
declare const gpxParser: any;

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  private tracks   = new BehaviorSubject<any>({type: "FeatureCollection", features: []});
  public tracksObs = this.tracks.asObservable();

  private currentEditable   = new Subject<number>();
  public currentEditableObs = this.currentEditable.asObservable();

  constructor() {
  }

  loadGpx(content) {
    let gpxDOM = new DOMParser().parseFromString(content, 'text/xml');
    let geoJSON = togeojson.gpx(gpxDOM);

    let storedGeoJSON:any = this.tracks.value;
    storedGeoJSON.features = storedGeoJSON.features.concat(geoJSON.features);

    for(let idx in storedGeoJSON.features){
      storedGeoJSON.features[idx].properties.distance  = this.calcDistance(storedGeoJSON.features[idx].geometry.coordinates);
      storedGeoJSON.features[idx].properties.elevation = this.calcElevation(storedGeoJSON.features[idx].geometry.coordinates);
      storedGeoJSON.features[idx].properties.visible   = true;

      if(storedGeoJSON.features[idx].properties.color == undefined) {
        let color = this.pickRandomColor();
        storedGeoJSON.features[idx].properties.color = color;
      }
    }

    this.tracks.next(storedGeoJSON);
  }

  startEdit(id) {
    console.log(this.tracks.value.features[id].properties.visible);
    if(this.tracks.value.features[id].properties.visible) {
      this.currentEditable.next(id);
    }
  }

  postTracks(tracks) {
    for(let idx in tracks.features){
      tracks.features[idx].properties.distance  = this.calcDistance(tracks.features[idx].geometry.coordinates);
      tracks.features[idx].properties.elevation = this.calcElevation(tracks.features[idx].geometry.coordinates);  
    }

    this.tracks.next(tracks);
  }

  pickRandomColor() {
    let h = 1 + Math.random() * (1 - 360);
    let s = 50;
    let l = 50;
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  }

  calcDistance(coordinates: Array<Array<number>>):number {
    let distance: number = 0;
    for(let i=0; i<coordinates.length-1; i++){
      distance += this.calcDistanceBetween(coordinates[i],coordinates[i+1]);
    }

    return Math.round(distance/1000);
  }

  calcDistanceBetween(wpt1:Array<number>, wpt2:Array<number>):number {
    let latlng1:any = {};
    latlng1.lat = wpt1[0];
    latlng1.lon = wpt1[1];

    let latlng2:any = {};
    latlng2.lat = wpt2[0];
    latlng2.lon = wpt2[1];

    var rad = Math.PI / 180,
		    lat1 = latlng1.lat * rad,
		    lat2 = latlng2.lat * rad,
		    sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2),
		    sinDLon = Math.sin((latlng2.lon - latlng1.lon) * rad / 2),
		    a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
		    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	  return 6371000 * c;
  }

  calcElevation(coordinates: Array<Array<number>>) {
    let positive = 0,
        negative = 0,
        ret:any = {};

    for (var i = 0; i < coordinates.length - 1; i++) {
        var diff = coordinates[i + 1][2] - coordinates[i][2];

        if (diff < 0) {
          negative += diff;
        } else if (diff > 0) {
          positive += diff;
        }
    }

    ret.positive = Math.round(Math.abs(positive)) || null;
    ret.negative = Math.round(Math.abs(negative)) || null;

    return ret;
};

}
