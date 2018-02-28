import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../services/connector.service';

@Component({
  selector: 'app-users',
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.css']
})
export class UsersComponent implements OnInit {

  private connector: ConnectorService;

  constructor(connector: ConnectorService) {
    this.connector = connector;
  }

  ngOnInit() {
  }

}
