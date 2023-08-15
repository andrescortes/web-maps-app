import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'map-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit {
  @Input() lgnLat?: [number, number];
  @ViewChild('map') divMap?: ElementRef;

  ngAfterViewInit(): void {
    if (!this.lgnLat) {
      throw new Error('The element has not been initialized');
    }
    if (!this.divMap) {
      throw new Error('The element #map is not defined');
    }
    const map =new Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.lgnLat,
      zoom: 13,
      interactive: false
    });

    new Marker()
    .setLngLat(this.lgnLat)
    .addTo(map);

  }

}
