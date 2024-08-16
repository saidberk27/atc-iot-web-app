import { Component, OnInit } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import { Schema } from '../../../amplify/data/resource';

@Component({
  selector: 'app-api-test-component',
  standalone: true,
  imports: [],
  templateUrl: './api-test-component.component.html',
  styleUrl: './api-test-component.component.css'
})
export class ApiTestComponentComponent implements OnInit {
  apiText = "Henüz Veri Gelmedi";

  ngOnInit() {
    const client = generateClient<Schema>();
    client.queries.getIoTMessages({
      TableName: "IoTMessages",
    }).then((response) => {
      console.log(response);
      // Handle the potential null case
      this.apiText = response.data ?? "Veri alınamadı";
    }).catch((error) => {
      console.error('Error fetching data:', error);
      this.apiText = "Hata oluştu";
    });
  }
}