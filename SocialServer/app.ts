const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const format = require('util').format;
const moment = require('moment');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const MONGO_URL = 'mongodb://127.0.0.1:27017/';
const MONGO_DB_NAME = 'users';
const MONGO_COLLECTION = 'usersCollection';


app.post('/login', (req, res) => {
  try {
    MongoClient.connect(MONGO_URL, function (err, client) {
      if(err) res.status(400).send({messgae: err.messgae});

      const db = client.db(MONGO_DB_NAME);
      const collection = db.collection(MONGO_COLLECTION);
      collection.find(
        {user_name: req.body.username, password: req.body.password}
        ).toArray(function(err, results) {
        client.close();

        if (results.length > 0) {
          const data = {
            id: results[0].id,
            name: results[0].name,
            birthday: parseInt(results[0].birthday) * 1000,
            hobbies: results[0].hobbies,
            friends: results[0].friends.map(function (friend) {return {id: friend}}),
          }
          res.status(200).send({isLoggedIn: true, profile: data});
        } else {
          res.status(401).send({
            isLoggedIn: false,
            message: 'username or password incorrect',
        })}
      })});
  } catch (e) {
    res.status(400).send({messgae: e.messgae});
  }

});

app.get('/users', (req, res) => {
  try {
    MongoClient.connect(MONGO_URL, function (err, client) {
      if(err) res.status(400).send({messgae: err.messgae});

      const db = client.db(MONGO_DB_NAME);
      const collection = db.collection(MONGO_COLLECTION);
      collection.find({}).toArray(function(err, results) {
        client.close();
        const data = results.length > 0 ? results.map((record) => {
          return {
            id: record.id,
            name: record.name,
          }
        }) : [];
        res.status(200).send({users: data});
      })});
  } catch (e) {
    res.status(400).send({messgae: e.messgae});
  }
});

app.post('/twoweeks', (req, res) => {
  try {
    MongoClient.connect(MONGO_URL, function (err, client) {
      if(err) res.status(400).send({messgae: err.messgae});

      let friendsList = JSON.parse(req.body.friends);
      const db = client.db(MONGO_DB_NAME);
      const collection = db.collection(MONGO_COLLECTION);
      collection.find({id: {$in: friendsList}}).toArray(function(err, results) {
          results.length > 0 ? results.map((record) => {
            record.friends.map((id) => friendsList.push(id));
          }) : null;
        collection.find({id: {$in: friendsList}}).toArray(function(err, results) {
          let data = results.map((record) => {
            let dateA = moment();
            let temp = moment.unix(record.birthday);
            let dateB = moment([moment(dateA).year(), moment(temp).month(), moment(temp).date()]);
            const diff = dateB.diff(dateA, 'days', true);
            if (diff % 365 < 14 && diff > 0) {
              return {
                id: record.id,
                name: record.name,
                birthday: record.birthday,
              }
          } else {
            return null;
          }})
          client.close();
          res.status(200).send({users: data.filter((user) => user !== null).sort((a, b) => {
            let tempA = moment.unix(a.birthday);
            let tempB = moment.unix(b.birthday);
            return moment([2000, moment(tempA).month(), moment(tempA).date()]) -
                   moment([2000, moment(tempB).month(), moment(tempB).date()])
          })});
        })
      })});
  } catch (e) {
    res.status(400).send({messgae: e.messgae});
  }
});

app.post('/potential', (req, res) => {
  function isSharingHobby(listA, listB) {
    let counter = 0;
    while (counter < listA.length) {
      if (listB.indexOf(listA[counter]) > -1) { return true }
      counter++;
    }
    return false;
  };

  function isCloseBirthday(dateA, dateB) {
    let birthdayA = moment([2000, moment.unix(dateA).month(), moment.unix(dateA).date()]);
    let birthdayB = moment([2000, moment.unix(dateB).month(), moment.unix(dateB).date()]);
    let diff = birthdayA > birthdayB ?
      birthdayA.diff(birthdayB, 'days', true) : birthdayB.diff(birthdayA, 'days', true);
    return (diff < 6);
  }

  try {
    MongoClient.connect(MONGO_URL, function (err, client) {
      if(err) res.status(400).send({messgae: err.messgae});

      let hobbies = JSON.parse(req.body.hobbies);
      let birthday = parseInt(req.body.birthday);
      let userId = req.body.userId;
      const db = client.db(MONGO_DB_NAME);
      const collection = db.collection(MONGO_COLLECTION);
      collection.find({id: {$ne: userId}}).toArray(function(err, results) {
        client.close();
        const data = results.length > 0 ? results.map((record) => {
            if (isSharingHobby(hobbies, record.hobbies) && isCloseBirthday(birthday, record.birthday)) {
              return {
                id: record.id,
                name: record.name,
                birthday: record.birthday,
              }
            } else {
              return null;
            }
          }) : null;
          console.log(data);
          res.status(200).send({users: data.filter((user) => user !== null)});
        })
      })
  } catch (e) {
    res.status(400).send({messgae: e.messgae});
  }
})

app.get('/upcoming', (req, res) => {
  try {
    MongoClient.connect(MONGO_URL, function (err, client) {
      if(err) res.status(400).send({messgae: err.messgae});

      const db = client.db(MONGO_DB_NAME);
      const collection = db.collection(MONGO_COLLECTION);
      collection.find({}).toArray(function(err, results) {
        client.close();
        const data = results.length > 0 ? results.map((record) => {
            let dateA = moment();
            let temp = moment.unix(record.birthday);
            let dateB = moment([moment(dateA).year(), moment(temp).month(), moment(temp).date()]);
            const diff = dateB.diff(dateA, 'days', true);
            if (diff > 0) {
            return {
              id: record.id,
              name: record.name,
              birthday: record.birthday,
            }
          } else {
            return null;
            }}) : [];
          res.status(200).send({users: data.filter((user) => user !== null).sort((a, b) => {
            let tempA = moment.unix(a.birthday);
            let tempB = moment.unix(b.birthday);
            return moment([2000, moment(tempA).month(), moment(tempA).date()]) -
              moment([2000, moment(tempB).month(), moment(tempB).date()])
          })});
      })});
  } catch (e) {
    res.status(400).send({messgae: e.messgae});
  }
});

app.post('/addfriend', (req, res) => {
  try {
    MongoClient.connect(MONGO_URL, function (err, client) {
      if(err) res.status(400).send({messgae: err.messgae});

      let friends = JSON.parse(req.body.friends);
      let userId = req.body.userId;

      const db = client.db(MONGO_DB_NAME);
      const collection = db.collection(MONGO_COLLECTION);
      collection.update({id: userId}, { $set: {friends: friends}}, function(err, results) {
        collection.find({id: userId}).toArray(function(err, results) {
          client.close();

          if (results.length > 0) {
            const data = {
              id: results[0].id,
              name: results[0].name,
              birthday: parseInt(results[0].birthday) * 1000,
              hobbies: results[0].hobbies,
              friends: results[0].friends.map(function (friend) {
                return { id: friend }
              }),
            }
            console.log(data);
            res.status(200).send({ profile: data });
          }
          res.status(400);
        })})});
  } catch (e) {
    res.status(400).send({messgae: e.messgae});
  }

});

app.listen(5000, () => console.log('server running on port 5000!'));