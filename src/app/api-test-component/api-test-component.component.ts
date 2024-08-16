import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';
import { interval, Subscription } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

interface IoTMessage {
  payload: string;
  messageId: string;
  timestamp: number;
}

@Component({
  selector: 'app-iot-messages-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <table>
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Message ID</th>
          <th>Payload</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let message of sortedMessages">
          <td>{{ formatTimestamp(message.timestamp) }}</td>
          <td>{{ message.messageId }}</td>
          <td>{{ message.payload }}</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
  `]
})
export class IoTMessagesTableComponent implements OnInit, OnDestroy {
  messages: IoTMessage[] = [];
  sortedMessages: IoTMessage[] = [];
  private subscription: Subscription;

  constructor() {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    const client = generateClient<Schema>();

    this.subscription = interval(200).pipe(  // Her 5 saniyede bir sorgu yap
      startWith(0),
      switchMap(() => client.queries.getIoTMessages({ TableName: "IoTMessages" }))
    ).subscribe({
      next: (response) => {
        if (response.data) {
          const newMessages = this.cleanData(JSON.parse(response.data));
          if (this.hasNewMessages(newMessages)) {
            this.messages = newMessages;
            this.sortAndFilterMessages();
          }
        }
      },
      error: (error) => console.error('Error fetching data:', error)
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cleanData(data: any[]): IoTMessage[] {
    return data.map(item => ({
      payload: item.payload,
      messageId: item['messageId '].trim(),
      timestamp: item['timestamp ']
    }));
  }

  hasNewMessages(newMessages: IoTMessage[]): boolean {
    if (newMessages.length !== this.messages.length) return true;
    return JSON.stringify(newMessages) !== JSON.stringify(this.messages);
  }

  sortAndFilterMessages() {
    this.sortedMessages = this.messages
      .filter(message => message.timestamp !== 0 && message.timestamp !== undefined)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  formatTimestamp(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }
}