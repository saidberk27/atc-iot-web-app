import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource, XYZ } from 'ol/source';
import { Style, Icon } from 'ol/style';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { AccordionModule } from 'primeng/accordion';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { Subscription, interval } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { tr } from 'date-fns/locale';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Button } from 'primeng/button';

Chart.register(...registerables, zoomPlugin);

interface IoTMessage {
  payload: string;
  messageId: string;
  timestamp: number;
}

interface TimeFrame {
  name: string;
  value: string;
}

@Component({
  selector: 'app-sensor-screen',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, CardModule, ChartModule, AccordionModule, Button],
  templateUrl: './api-test-component.component.html',
  styleUrl: './api-test-component.component.css'
})
export class SensorScreenComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapElement') mapElement!: ElementRef;
  @ViewChild('chart') chart: any;

  readonly sensorData: string = 'Sıcaklık ve GPS';
  readonly vehicleId: string = '01 BFG 2423';
  readonly sensorId: string = 'TS2024x1';
  readonly chartHeight = '600px';

  temperature: number | null = null;
  lastUpdate: Date | null = null;
  map!: Map;
  marker!: Feature;
  currentLocation: [number, number] = [32.48039, 37.86536];
  lastValidGPSData: [number, number] | null = null;
  subscription: Subscription | null = null;
  noDataMessage: string | null = null;

  readonly timeFrames: TimeFrame[] = [
    { name: 'Son 1 Dakika', value: 'MINUTE' },
    { name: 'Son 1 Saat', value: 'HOUR' },
    { name: 'Son 1 Gün', value: 'DAY' },
    { name: 'Son 1 Hafta', value: 'WEEK' }
  ];
  selectedTimeFrame: TimeFrame = this.timeFrames[1];

  chartData: any;
  chartOptions: any;

  private readonly client = generateClient<Schema>();

  constructor(private router: Router) {
    this.initChart();
  }

  // Lifecycle Methods
  ngOnInit() {
    this.timeFrameCheck();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  // Data Fetching and Processing Methods
  async timeFrameCheck() {
    for (const timeFrame of this.timeFrames) {
      this.selectedTimeFrame = timeFrame;
      if (await this.fetchMessages()) break;
    }

    this.noDataMessage = this.temperature === null || this.lastUpdate === null
      ? "Herhangi bir veri bulunamadı. Lütfen sensörün çalıştığından emin olun."
      : null;

    if (!this.noDataMessage) this.startRealTimeUpdates();
  }

  async fetchMessages(returnMessages: boolean = false): Promise<IoTMessage[] | boolean> {
    try {
      const response = await this.client.queries.getIoTMessages({
        TableName: "IoTMessages2",
        TimeFrame: this.selectedTimeFrame.value
      });
      if (response.data) {
        const messages = this.cleanData(JSON.parse(response.data));

        if (returnMessages) {
          return messages;
        }

        this.updateChartData(messages);
        if (messages.length > 0) {
          const latestMessage = messages[0];
          await this.updateGPSData(latestMessage);
          this.updateTemperatureAndTimestamp(latestMessage);
          return true;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return returnMessages ? [] : false;
  }

  cleanData(data: any[]): IoTMessage[] {
    return data
      .map(item => ({
        payload: item.payload,
        messageId: item.messageId.trim(),
        timestamp: item.timestamp
      }))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  startRealTimeUpdates() {
    this.subscription = interval(5000).subscribe(() => this.fetchMessages());
  }

  // GPS and Location Methods
  async updateGPSData(message: IoTMessage) {
    try {
      const payloadData = JSON.parse(message.payload);
      if (payloadData?.gps_data) {
        const newLocation = this.parseGPSData(payloadData.gps_data);
        if (newLocation) {
          this.lastValidGPSData = newLocation;
          this.updateLocation(newLocation);
        } else if (this.lastValidGPSData === null) {
          console.log('Invalid GPS data, searching for last valid data');
          await this.findLastValidGPSData();
        } else {
          console.log('Invalid GPS data, using last known valid location');
          this.updateLocation(this.lastValidGPSData);
        }
      }
    } catch (error) {
      console.error('Error parsing GPS data:', error);
    }
  }

  async findLastValidGPSData() {
    try {
      const currentTimeFrame = this.selectedTimeFrame;
      this.selectedTimeFrame = this.timeFrames.find(tf => tf.value === 'DAY') || this.timeFrames[2];

      const messages = await this.fetchMessages(true) as IoTMessage[];

      if (messages.length > 0) {
        for (const message of messages) {
          const payloadData = JSON.parse(message.payload);
          if (payloadData?.gps_data) {
            const location = this.parseGPSData(payloadData.gps_data);
            if (location) {
              console.log('Found valid GPS data');
              this.lastValidGPSData = location;
              this.updateLocation(location);
              break;
            }
          }
        }
        if (!this.lastValidGPSData) {
          console.log('No valid GPS data found in recent messages');
        }
      }

      this.selectedTimeFrame = currentTimeFrame;
      await this.fetchMessages();
    } catch (error) {
      console.error('Error searching for valid GPS data:', error);
    }
  }

  updateLocation(newLocation: [number, number]) {
    if (newLocation[0] !== 0 && newLocation[1] !== 0) {
      this.currentLocation = newLocation;
      const olLocation = fromLonLat(this.currentLocation);
      this.marker.setGeometry(new Point(olLocation));
      this.map.getView().setCenter(olLocation);
      this.lastValidGPSData = newLocation;
    } else {
      console.log('Invalid location data, skipping update');
    }
  }

  parseGPSData(gpsData: string): [number, number] | null {
    const match = gpsData.match(/\$GPGLL,(\d+\.\d+),([NS]),(\d+\.\d+),([EW])/);
    if (match && match[1] && match[2] && match[3] && match[4]) {
      const lat = this.convertToDecimalDegrees(parseFloat(match[1]), match[2]);
      const lon = this.convertToDecimalDegrees(parseFloat(match[3]), match[4]);
      return [lon, lat];
    }
    return null;
  }

  convertToDecimalDegrees(value: number, direction: string): number {
    const degrees = Math.floor(value / 100);
    const minutes = value - (degrees * 100);
    let decimalDegrees = degrees + (minutes / 60);
    if (direction === 'S' || direction === 'W') {
      decimalDegrees = -decimalDegrees;
    }
    return decimalDegrees;
  }

  // Temperature Methods
  updateTemperatureAndTimestamp(message: IoTMessage) {
    try {
      const payloadData = JSON.parse(message.payload);
      if (payloadData?.temperature) {
        const tempMatch = payloadData.temperature.match(/Temperature\s*=\s*([\d.]+)/);
        if (tempMatch?.[1]) {
          this.temperature = parseFloat(tempMatch[1]);
          this.lastUpdate = new Date(message.timestamp);
        } else {
          console.error('Temperature format is not as expected');
        }
      } else {
        console.error('Temperature data is missing or not in the expected format');
      }
    } catch (error) {
      console.error('Error parsing temperature data:', error);
    }
  }

  // Map Methods
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

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [this.marker]
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: '../../../../../assets/img/icons/truck-icon.png',
          scale: 0.2
        })
      })
    });

    this.map.addLayer(vectorLayer);
  }

  // Chart Methods
  initChart() {
    this.chartData = {
      labels: [],
      datasets: [{
        label: 'Sıcaklık',
        data: [],
        fill: false,
        borderColor: '#42A5F5',
        tension: 0.4
      }]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: { unit: 'minute' },
          adapters: { date: { locale: tr } },
          ticks: { color: '#495057' },
          grid: { color: 'rgba(255,255,255,0.2)' }
        },
        y: {
          beginAtZero: true,
          suggestedMin: 20,
          suggestedMax: 40,
          ticks: { stepSize: 0.1, color: '#495057' },
          title: { display: true, text: 'Sıcaklık (°C)', color: '#495057' },
          grid: { color: 'rgba(255,255,255,0.2)' }
        }
      },
      plugins: {
        legend: { labels: { color: '#495057' } },
        title: {
          display: true,
          text: 'Zaman İçinde Sıcaklık Değişimi',
          font: { size: 16 },
          color: '#495057'
        },
        zoom: {
          zoom: {
            wheel: { enabled: true },
            pinch: { enabled: true },
            mode: 'xy',
          },
          pan: { enabled: true, mode: 'xy' }
        }
      },
      animation: false
    };
  }

  updateChartData(messages: IoTMessage[]) {
    this.chartData = {
      ...this.chartData,
      labels: messages.map(m => new Date(m.timestamp)),
      datasets: [{
        ...this.chartData.datasets[0],
        data: messages.map(m => {
          const tempMatch = m.payload.match(/Temperature\s*=\s*([\d.]+)/);
          return tempMatch ? parseFloat(tempMatch[1]) : null;
        })
      }]
    };
  }

  zoomIn() {
    this.chart?.chart?.zoom(1.1);
  }

  zoomOut() {
    this.chart?.chart?.zoom(0.9);
  }

  // Navigation Methods
  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }

  // Event Handlers
  onTimeFrameChange() {
    this.fetchMessages();
  }
}