import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit {

  public markers: MarkerAndColor[] = [];

  @ViewChild('map') divMap?: ElementRef;
  public zoom: number = 13;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-74.08, 4.65);
  public lat: number = this.currentLngLat.lat;
  public lng: number = this.currentLngLat.lng;

  ngAfterViewInit(): void {
    if (!this.divMap) {
      throw new Error('The element #map is not defined');
    }
    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });
    this.loadFromLocalStorage();
    // const makerHtml = document.createElement('div');
    // makerHtml.innerHTML = 'Hello World';
    // const marker = new Marker({
    //   element: makerHtml
    // })
    // .setLngLat(this.currentLngLat)
    // .addTo(this.map);
  }

  createMarker(): void {
    if (!this.map) {
      throw new Error('The element has not been initialized');
    }
    const color = '#xxxxxx'.replace(/x/g, () => (Math.random() * 16 | 0).toString(16));
    const lgnLat = this.map.getCenter();
    this.addMarker(lgnLat, color);
  }

  addMarker(lngLat: LngLat, color: string = 'red'): void {
    if (!this.map) {
      throw new Error('The element has not been initialized');
    }
    const marker = new Marker({
      color: color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    this.markers.push({
      color,
      marker
    })
    this.saveToLocalStorage();
    marker.on('dragend', () => {
      this.saveToLocalStorage();
    });
  }

  removeMarker(index: number): void {
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
  }

  flyTo(marker: Marker): void {
    this.map?.flyTo({
      zoom: 15,
      center: marker.getLngLat(),
      speed: 1,
      curve: 2,
      essential: true,
      screenSpeed: 5,
      pitch: 0,
    })
  }

  saveToLocalStorage(): void {
    const plainMarkers: PlainMarker[] = this.markers.map(({ color, marker }) => ({
      color,
      lngLat: marker.getLngLat().toArray()
    }));
    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  loadFromLocalStorage(): void {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);
    plainMarkers.forEach(({ color, lngLat }) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat);
      this.addMarker(coords, color);
    });
  }
}
