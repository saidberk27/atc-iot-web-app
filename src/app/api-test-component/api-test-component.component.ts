import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { Subscription, interval } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

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
  selector: 'app-iot-messages-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, TableModule],
  template: `
    <div>
      <p-dropdown [options]="timeFrames" [(ngModel)]="selectedTimeFrame" 
                  optionLabel="name" (onChange)="onTimeFrameChange()"></p-dropdown>
      
      <p-table [value]="messages" [paginator]="true" [rows]="10">
        <ng-template pTemplate="header">
          <tr>
            <th>Tarih</th>
            <th>Mesaj Kimlik Numarası</th>
            <th>Mesaj İçeriği</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-message>
          <tr>
            <td>{{ formatTimestamp(message.timestamp) }}</td>
            <td>{{ message.messageId }}</td>
            <td>{{ message.payload }}</td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: [`
    :host ::ng-deep .p-dropdown {
      margin-bottom: 1rem;
    }
  `]
})
export class IoTMessagesTableComponent implements OnInit, OnDestroy {
  messages: IoTMessage[] = [];
  private subscription: Subscription | null = null;

  timeFrames: TimeFrame[] = [
    { name: 'Son 1 Dakika', value: 'MINUTE' },
    { name: 'Son 1 Saat', value: 'HOUR' },
    { name: 'Son 1 Gün', value: 'DAY' },
    { name: 'Son 1 Hafta', value: 'WEEK' }
  ];
  selectedTimeFrame: TimeFrame = this.timeFrames[0];

  constructor() { }

  ngOnInit() {
    this.startRealTimeUpdates();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  startRealTimeUpdates() {
    this.subscription = interval(100).subscribe(() => {
      this.fetchMessages();
    });
  }

  onTimeFrameChange() {
    this.fetchMessages();
  }

  async fetchMessages() {
    const client = generateClient<Schema>();
    try {
      const response = await client.queries.getIoTMessages({
        TableName: "IoTMessages2",
        TimeFrame: this.selectedTimeFrame.value
      });
      if (response.data) {
        this.messages = this.cleanData(JSON.parse(response.data));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  cleanData(data: any[]): IoTMessage[] {
    return data.map(item => ({
      payload: item.payload,
      messageId: item.messageId.trim(),
      timestamp: item.timestamp
    })).sort((a, b) => b.timestamp - a.timestamp);
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}