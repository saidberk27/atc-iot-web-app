import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { Style, Circle, Fill, Icon } from 'ol/style';

@Component({
  selector: 'app-live-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./sensor-screen.component.html`,
  styleUrl: `./sensor-screen.component.css`
})
export class LiveLocationComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapElement') mapElement!: ElementRef;

  temperature: number = 26;
  lastUpdate: Date = new Date();
  map!: Map;
  marker!: Feature;
  currentLocation: [number, number] = [32.8597, 39.9334]; // Başlangıç konumu (Ankara)
  updateInterval: any;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Başlangıç konumunu istediğiniz konuma ayarlayabilirsiniz
    // Örnek: this.currentLocation = [35.2433, 38.9637]; // Kayseri
  }

  ngAfterViewInit() {
    this.initMap();
    this.startLocationUpdate();
  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  initMap() {
    const initialLocation = fromLonLat(this.currentLocation);

    this.map = new Map({
      target: this.mapElement.nativeElement,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
            attributions: '© Google Maps'
          })
        })
      ],
      view: new View({
        center: initialLocation,
        zoom: 15
      })
    });

    this.marker = new Feature({
      geometry: new Point(initialLocation)
    });

    const vectorSource = new VectorSource({
      features: [this.marker]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '../../../../../assets/img/icons/truck-icon.png', // Kamyon ikonunuzun yolu
          scale: 0.2 // İkonun boyutunu ayarlayın
        })
      })
    });

    this.map.addLayer(vectorLayer);
  }

  startLocationUpdate() {
    this.updateInterval = setInterval(() => {
      this.updateLocation();
    }, 100); // Her saniye güncelle
  }

  updateLocation() {
    // 5 metre kuzeye hareket et (yaklaşık olarak 0.000045 derece)
    this.currentLocation[1] += 0.000045;

    const newLocation = fromLonLat(this.currentLocation);
    this.marker.setGeometry(new Point(newLocation));
    this.map.getView().setCenter(newLocation);

    this.lastUpdate = new Date();
  }

  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }
}