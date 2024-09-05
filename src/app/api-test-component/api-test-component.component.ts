import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  sensorData: string = '';
  vehicleId: string = '';
  sensorId: string = '';

  chartHeight = '600px'; // Canvas yüksekliği

  temperature: number | null = null;
  lastUpdate: Date | null = null;
  map!: Map;
  marker!: Feature;
  currentLocation: [number, number] = [32.48039, 37.86536];
  updateInterval: any;
  subscription: Subscription | null = null;

  timeFrames: TimeFrame[] = [
    { name: 'Son 1 Dakika', value: 'MINUTE' },
    { name: 'Son 1 Saat', value: 'HOUR' },
    { name: 'Son 1 Gün', value: 'DAY' },
    { name: 'Son 1 Hafta', value: 'WEEK' }
  ];
  selectedTimeFrame: TimeFrame = this.timeFrames[1]; // Default to 'Son 1 Saat'
  noDataMessage: string | null = null;

  chartData: any;
  chartOptions: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.initChart();
  }

  ngOnInit() {
    this.timeFrameCheck();
  }

  ngAfterViewInit() {
    // Delay map initialization to ensure the container is rendered

    setTimeout(() => {
      this.initMap();
      this.startLocationUpdate();
    }, 0);


  }

  ngOnDestroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  async timeFrameCheck() {
    for (const timeFrame of this.timeFrames) {
      this.selectedTimeFrame = timeFrame;
      await this.fetchMessages();
      if (this.temperature !== null && this.lastUpdate !== null) {
        break;
      }
    }

    if (this.temperature === null || this.lastUpdate === null) {
      this.noDataMessage = "Herhangi bir veri bulunamadı. Lütfen sensörün çalıştığından emin olun.";
    } else {
      this.noDataMessage = null;
      this.startRealTimeUpdates();
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
    //TODO  burayi NVME verisine göre implemente et
  }

  updateLocation() {
    // 5 metre kuzeye hareket et (yaklaşık olarak 0.000045 derece)
    this.currentLocation[1] += 0.000045;

    const newLocation = fromLonLat(this.currentLocation);
    this.marker.setGeometry(new Point(newLocation));
    this.map.getView().setCenter(newLocation);

    this.lastUpdate = new Date();
  }

  startRealTimeUpdates() {
    this.subscription = interval(5000).subscribe(() => {
      this.fetchMessages();
    });
  }

  async fetchMessages() {
    const client = generateClient<Schema>();
    try {
      const response = await client.queries.getIoTMessages({
        TableName: "IoTMessages2",
        TimeFrame: this.selectedTimeFrame.value
      });
      if (response.data) {
        const messages = this.cleanData(JSON.parse(response.data));
        this.updateChartData(messages);
        if (messages.length > 0) {
          const latestMessage = messages[0];
          this.updateTemperatureAndTimestamp(latestMessage);
          return true;
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    return false;
  }

  updateTemperatureAndTimestamp(message: IoTMessage) {
    try {
      const payloadData = JSON.parse(message.payload);
      if (payloadData && typeof payloadData.temperature === 'string') {
        const tempMatch = payloadData.temperature.match(/Temperature\s*=\s*([\d.]+)/);
        if (tempMatch && tempMatch[1]) {
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

  cleanData(data: any[]): IoTMessage[] {
    return data.map(item => ({
      payload: item.payload,
      messageId: item.messageId.trim(),
      timestamp: item.timestamp
    })).sort((a, b) => b.timestamp - a.timestamp);
  }



  onTimeFrameChange() {
    this.fetchMessages();
  }


  initChart() {
    this.chartData = {
      labels: [],
      datasets: [
        {
          label: 'Sıcaklık',
          data: [],
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute'
          },
          adapters: {
            date: {
              locale: tr
            }
          },
          ticks: {
            color: '#495057'
          },
          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        },
        y: {
          beginAtZero: true,

          suggestedMin: 0,  // Y ekseninin minimum değeri
          suggestedMax: 50, // Y ekseninin maksimum değeri (sıcaklık aralığınıza göre ayarlayın)
          ticks: {
            stepSize: 5,    // Y eksenindeki adım büyüklüğü
            color: '#495057'
          },
          title: {
            display: true,
            text: 'Sıcaklık (°C)',
            color: '#495057'
          },

          grid: {
            color: 'rgba(255,255,255,0.2)'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        },
        title: {
          display: true,
          text: 'Zaman İçinde Sıcaklık Değişimi',
          font: {
            size: 16
          },
          color: '#495057'
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'xy',
          },
          pan: {
            enabled: true,
            mode: 'xy',
          }
        }
      }
    };
  }


  zoomIn() {
    if (this.chart && this.chart.chart) {
      this.chart.chart.zoom(4.1);
    }
  }

  zoomOut() {
    if (this.chart && this.chart.chart) {
      this.chart.chart.zoom(0.9);
    }
  }


  updateChartData(messages: IoTMessage[]) {
    this.chartData.labels = messages.map(m => new Date(m.timestamp));
    this.chartData.datasets[0].data = messages.map(m => {
      const tempMatch = m.payload.match(/Temperature\s*=\s*([\d.]+)/);
      return tempMatch ? parseFloat(tempMatch[1]) : null;
    });

    // Force chart update
    this.chartData = { ...this.chartData };
  }


  navigateTo(destination: string) {
    this.router.navigate([`/${destination}`]);
  }
}