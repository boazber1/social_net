import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../../services/connector.service';
import * as moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['profile.component.css']
})
export class ProfileComponent implements OnInit {

  private connector: ConnectorService;
  private birthday: string;

  constructor(connector: ConnectorService) {
    this.connector = connector;
    this.birthday = moment(this.connector.profile.birthday).format('DD/MM/YYYY');
  }

  ngOnInit() {
  }

}
