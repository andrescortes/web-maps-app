import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap?: ElementRef;
  public zoom: number = 6;
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-72.6, 4.8);
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
    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners(): void {

    if (!this.map) {
      throw new Error('The element has not been initialized');
    }

    this.map.on('zoom', () => {
      this.zoom = this.map!.getZoom();
    });

    this.map.on('zoomend', () => {
      if (this.map!.getZoom() > 18) {
        this.map!.zoomTo(18);
      }
      this.zoom = this.map!.getZoom();
    });

    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter();
      console.log({ lngLat: this.currentLngLat });
      const { lng, lat } = this.currentLngLat;
      this.lng = lng;
      this.lat = lat;
      console.log({ lng, lat });
    })
  }

  zoomIn(): void {
    this.map?.zoomIn();
  }

  zoomOut(): void {
    this.map?.zoomOut();
  }

  zoomChanged(value: string): void {
    this.zoom = Number(value);
    this.map?.zoomTo(this.zoom);
  }
}
