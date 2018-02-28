import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../services/connector.service';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.css']
})
export class ActionsComponent implements OnInit {

  private connector: ConnectorService;

  constructor(connector: ConnectorService) {
    this.connector = connector;
  }

  ngOnInit() {
  }

}
