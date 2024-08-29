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
  template: `
    <div class="main-container">
      <h1 class="panel-title">CANLI KONUM</h1>
      <div class="location-container">
        <div #mapElement class="map-container"></div>
        <div class="temperature-container">
          <p class="temperature">Sıcaklık: {{ temperature }}°C</p>
          <p class="last-update">Son Güncelleme: {{ lastUpdate | date:'dd.MM.yyyy HH:mm' }}</p>
        </div>
      </div>
      <div class="navigation-container">
        <button class="nav-button" (click)="navigateTo('ana-sayfa')">
          <i class="pi pi-home"></i>
          Ana Sayfa
        </button>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    .main-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: #f5f7fa;
      padding: 20px;
      box-sizing: border-box;
    }

    .panel-title {
      font-family: 'Poppins', sans-serif;
      font-size: 2rem;
      color: #333;
      margin-bottom: 20px;
      text-align: center;
    }

    .location-container {
      background-color: #ffffff;
      border-radius: 10px;
      padding: 20px;
      width: 100%;
      max-width: 600px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .map-container {
      width: 100%;
      height: 300px;
      border-radius: 8px;
      overflow: hidden;
    }

    .temperature-container {
      margin-top: 20px;
      text-align: center;
    }

    .temperature {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }

    .last-update {
      font-size: 0.9rem;
      color: #666;
    }

    .navigation-container {
      margin-top: 20px;
    }

    .nav-button {
      background-color: #3498db;
      color: #ffffff;
      border: none;
      border-radius: 5px;
      padding: 10px 20px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .nav-button:hover {
      background-color: #2980b9;
    }

    .nav-button i {
      margin-right: 10px;
    }
  `]
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