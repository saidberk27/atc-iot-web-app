import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Style, Circle, Fill } from 'ol/style';

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
export class LiveLocationComponent implements OnInit, AfterViewInit {
  @ViewChild('mapElement') mapElement!: ElementRef;

  temperature: number = 26;
  lastUpdate: Date = new Date('2024-08-29T12:21:00');
  map!: Map;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Initialization logic if needed
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    const initialLocation = fromLonLat([32.8597, 39.9334]); // Ankara, Turkey coordinates

    this.map = new Map({
      target: this.mapElement.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: initialLocation,
        zoom: 12
      })
    });

    // Add a marker for the current location
    const marker = new Feature({
      geometry: new Point(initialLocation)
    });

    const vectorSource = new VectorSource({
      features: [marker]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: 'red' })
        })
      })
    });

    this.map.addLayer(vectorLayer);
  }

  updateLocation(longitude: number, latitude: number) {
    const newLocation = fromLonLat([longitude, latitude]);
    const vectorLayer = this.map.getLayers().getArray().find(layer => layer instanceof VectorLayer) as VectorLayer<VectorSource>;
    const feature = vectorLayer.getSource()?.getFeatures()[0];
    feature?.setGeometry(new Point(newLocation));
    this.map.getView().setCenter(newLocation);
  }

  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }
}