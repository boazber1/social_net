import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.css']
})
export class UserComponent implements OnInit {
  @Input() user;
  @Input() isFriend;
  @Input() isUser;
  @Input() addFriend;
  private birthday: string;

  constructor() {
    this.birthday = '';
  }

  ngOnInit() {
    this.birthday = this.user.birthday ? moment.unix(this.user.birthday).format('DD/MM/YYYY') : '';
  }

}
