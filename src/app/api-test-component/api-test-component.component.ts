import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { Subscription } from 'rxjs';
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
            <th>Timestamp</th>
            <th>Message ID</th>
            <th>Payload</th>
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
    { name: 'Last Hour', value: 'HOUR' },
    { name: 'Last Day', value: 'DAY' },
    { name: 'Last Week', value: 'WEEK' }
  ];
  selectedTimeFrame: TimeFrame = this.timeFrames[0];

  constructor() { }

  ngOnInit() {
    this.fetchMessages();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onTimeFrameChange() {
    this.fetchMessages();
  }

  async fetchMessages() {
    const client = generateClient<Schema>();
    try {
      console.log("deneme");

      const response = await client.queries.getIoTMessages({
        TableName: "IoTMessages",
        TimeFrame: this.selectedTimeFrame.value
      });
      console.log(response);
      if (response.data) {
        console.log(response.data);
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
    })).sort((a, b) => b.timestamp - a.timestamp); // Sunucudan gelen verileri tarihe göre sırala
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}