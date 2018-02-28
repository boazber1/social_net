import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../services/connector.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  private connector;

  constructor(connector: ConnectorService) {
    this.connector = connector;
  }

  ngOnInit() {
  }

}
