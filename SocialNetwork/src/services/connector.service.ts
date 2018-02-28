import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileData } from '../types/Profile';
import { ProfileDataInitial } from '../initial/Profile';
import { UserData } from '../types/User';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config/api';
import { HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ConnectorService {

  profile: ProfileData;
  users: UserData[];
  usersTitle: string;
  error: Error;

  constructor(private router: Router, private http: HttpClient) {
    this.error = null;
    this.profile = ProfileDataInitial;
    this.users = [];
    this.usersTitle = 'All Users';
  }

  doLogin = (username: string, password: string) => {
    this.error = null;
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);
    this.http.post(`${API_URL}/login`, body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).toPromise().then((res) => {
      this.showAllUsers();
      this.profile = res.profile;
      this.router.navigate(['dashboard']);
    }).catch((err) => {
      this.error = new Error(err.error.message);
    });
  };

  showAllUsers = () => {
    this.usersTitle = 'All Users';
    this.http.get(`${API_URL}/users`).toPromise().then((res) => {
      this.users = res.users;
    }).catch((err) => {
      this.error = new Error(err.error.message);
    })
  };

  showTwoWeeksBirthdays = () => {
    this.usersTitle = 'Users that have birthday soon';
    const body = new HttpParams()
      .set('friends', JSON.stringify(this.profile.friends.map((user) => user.id)));
    this.http.post(`${API_URL}/twoweeks`, body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).toPromise().then((res) => {
      this.users = res.users;
    }).catch((err) => {
      this.error = new Error(err.error.message);
    })
  };

  showPotential = () => {
    this.usersTitle = 'Potential friends';
    const body = new HttpParams()
      .set('hobbies', JSON.stringify(this.profile.hobbies))
      .set('birthday', JSON.stringify(this.profile.birthday))
      .set('userId', this.profile.id);
    this.http.post(`${API_URL}/potential`, body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).toPromise().then((res) => {
      this.users = res.users;
    }).catch((err) => {
      this.error = new Error(err.error.message);
    })
  };

  showUpcomingBirthdays = () => {
    this.usersTitle = 'Users - Upcoming birthdays this year';
    this.http.get(`${API_URL}/upcoming`).toPromise().then((res) => {
      this.users = res.users;
    }).catch((err) => {
      this.error = new Error(err.error.message);
    })
  };

  isFriend = (user: UserData) => {
    let i = 0;
    while (i < this.profile.friends.length) {
      if (this.profile.friends[i].id === user.id) {
        return true;
      }
     i++;
    }
    return false;
  }

  isUser = (user: UserData) => {
    return user.id === this.profile.id;
  }

  addFriend = (user: UserData) => {
    let newFriends = this.profile.friends;
    if (newFriends.length > 4) {
      newFriends = newFriends.slice(1,5);
    }
    newFriends.push(user);

    this.profile.friends = newFriends;
    const body = new HttpParams()
      .set('friends', JSON.stringify(newFriends.map((user) => user.id)))
      .set('userId', this.profile.id);
    this.http.post(`${API_URL}/addfriend`, body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).toPromise().then((res) => {
      this.profile = res.profile;
    }).catch((err) => {
      this.error = new Error(err.error.message);
    })
  }
}
