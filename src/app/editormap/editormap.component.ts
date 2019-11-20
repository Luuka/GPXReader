import { Component, OnInit } from '@angular/core';
import { EditorService } from '../editor.service';
import { from, Subscription } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-editable';

@Component({
  selector: 'app-editormap',
  templateUrl: './editormap.component.html',
  styleUrls: ['./editormap.component.scss']
})
export class EditormapComponent implements OnInit {

  constructor(private editorService: EditorService) { }

  private tracksObs: Subscription;
  private tracks = {};
  private ignoreNextTracksObs = false;

  private currentEditableObs: Subscription;
  private currentEditable:number = null;

  private map: L.Map;
  private layers: L.FeatureGroup;

  ngOnInit() {
    console.log('ngOnInit');
    let keepThis = this;
    this.map = L.map('map', ({editable: true} as any)).setView([50.6311634, 3.0599573], 12);

    this.map.on('editable:vertex:mousedown', function (e:any) {
      console.log(e);
      e.vertex.continue();
    });

    this.map.on('editable:vertex:dragend editable:vertex:new editable:vertex:deleted editable:dragend', function(){
      let geoJson = keepThis.layers.toGeoJSON();
      keepThis.ignoreNextTracksObs = true;
      keepThis.editorService.postTracks(geoJson);
    });

    this.layers = L.featureGroup([]).addTo(this.map);

    var osmMap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {attribution: 'OpenStreetMap contributors'}),
    landMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {attribution: 'OpenTopoMap | OpenStreetMap contributors'});

    osmMap.addTo(this.map);

    var baseLayers = {
			"OpenStreetMap": osmMap,
			"OpenTopoMap": landMap
		};
		L.control.layers(baseLayers).addTo(this.map);

    this.tracksObs = this.editorService.tracksObs.subscribe(tracks => {

      if(keepThis.ignoreNextTracksObs) {
        keepThis.ignoreNextTracksObs = false;
        return;
      }

      this.layers.clearLayers();

      tracks.features.forEach(function(element, index){
        let opacity = 1;
        if(!element.properties.visible) {
          opacity = 0;
        }
          if(element.geometry.type == 'LineString') {

            let geoJson = L.geoJSON(element, {
              style: function () {
                //@TODO : display none if not visible instead of not adding it
                return {color: element.properties.color, opacity:opacity};
              }
            }).getLayers()[0];
            keepThis.layers.addLayer(geoJson);

        } else if(element.geometry.type == 'Point') {

          //@TODO : display none if not visible instead of not adding it
          let geoJson:any = L.geoJSON(element, {
            pointToLayer: function (feature, latlng) {

                let icon = L.divIcon({
                  className: 'custom-div-icon',
                  html: "<div style='background-color:"+element.properties.color+";width: 1rem;height: 1rem;border-radius: 2rem;border: .1rem solid white;' class='marker-pin'></div>",
                });

                return L.marker(latlng, {icon: icon, opacity:opacity});
            }
          }).getLayers()[0];

          geoJson.bindTooltip(element.properties.name, {direction:'top'});

          keepThis.layers.addLayer(geoJson);

          geoJson.enableEdit();
        }
        
      });
      
      let bounds = keepThis.layers.getBounds();
      if(bounds.isValid()){
        keepThis.map.fitBounds(bounds);
      }
    });

    this.currentEditableObs = this.editorService.currentEditableObs.subscribe(id => {
      this.layers.eachLayer(function(l:any){
        l.disableEdit();
      });

      let layer:any = this.layers.getLayers()[id];
      layer.enableEdit();
    });

  }

  ngOnDestroy(){
    console.log('ngOnDestroy');
    this.currentEditableObs.unsubscribe();
    this.currentEditableObs.unsubscribe();
  }
}
