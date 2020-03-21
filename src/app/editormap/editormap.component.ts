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
  private currentEditable: number = null;

  private map: L.Map;
  private layers: L.FeatureGroup;

  ngOnInit() {
    const editorMap = this;
    this.map = L.map('map', ({editable: true} as any)).setView([50.6311634, 3.0599573], 12);

    this.map.on('editable:vertex:mousedown', (e: any) => {
      e.vertex.continue();
    });

    this.map.on('editable:vertex:dragend editable:vertex:new editable:vertex:deleted editable:dragend', () => {
      const geoJson = editorMap.layers.toGeoJSON();
      editorMap.ignoreNextTracksObs = true;
      editorMap.editorService.postTracks(geoJson);
    });

    this.layers = L.featureGroup([]).addTo(this.map);

    const osmMap = L.tileLayer(
      'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      {attribution: 'OpenStreetMap contributors'}
    );
    const openTopoMap = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      {attribution: 'OpenTopoMap | OpenStreetMap contributors'}
    );

    osmMap.addTo(this.map);

    const baseLayers = {
      OpenStreetMap: osmMap,
      OpenTopoMap: openTopoMap
    };
    L.control.layers(baseLayers).addTo(this.map);

    this.tracksObs = this.editorService.tracksObs.subscribe(geoJSON => {

      if (editorMap.ignoreNextTracksObs) {
        editorMap.ignoreNextTracksObs = false;
        return;
      }

      this.layers.clearLayers();

      geoJSON.features.forEach((element, index) => {
        let opacity = 1;
        if (!element.properties.visible) {
          opacity = 0;
        }
        if (element.geometry.type === 'LineString') {

            const geoJson = L.geoJSON(element, {
              style() {
                // @TODO : display none if not visible instead of not adding it
                return {color: element.properties.color, opacity};
              }
            }).getLayers()[0];
            editorMap.layers.addLayer(geoJson);

        } else if (element.geometry.type === 'Point') {

          // @TODO : display none if not visible instead of not adding it
          const geoJson: any = L.geoJSON(element, {
            pointToLayer(feature, latlng) {

                const icon = L.divIcon({
                  className: 'custom-div-icon',
                  html: '<div style=\'' +
                    'background-color:' + element.properties.color + ';' +
                    'width: 1rem; ' +
                    'height: 1rem;' +
                    'border-radius: 2rem;' +
                    'border: .1rem solid white;\' ' +
                    'class=\'marker-pin\'></div>',
                });

                return L.marker(latlng, {icon, opacity});
            }
          }).getLayers()[0];

          geoJson.bindTooltip(element.properties.name, {direction: 'top'});

          editorMap.layers.addLayer(geoJson);

          geoJson.enableEdit();
        }

      });

      const bounds = editorMap.layers.getBounds();
      if (bounds.isValid()) {
        editorMap.map.fitBounds(bounds);
      }
    });

    this.currentEditableObs = this.editorService.currentEditableObs.subscribe(id => {
      if (id !== null) {
        this.layers.eachLayer((l: any) => {
          l.disableEdit();
        });

        const layer: any = this.layers.getLayers()[id];
        layer.enableEdit();
      } else {
        this.layers.eachLayer((l: any) => {
          l.disableEdit();
        });
      }
    });
  }

  ngOnDestroy() {
    this.currentEditableObs.unsubscribe();
    this.currentEditableObs.unsubscribe();
  }
}
