const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { log } = require('console');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});
app.listen(5000); // start Node + Express server on port 5000

const MongoClient = require('mongodb').MongoClient;
//const url = 'mongodb+srv://brinkad1:munkelwitz@cluster0.claj68m.mongodb.net/';
const url = 'mongodb+srv://COP4331:%40COP4331bestgroup@cluster0.3oshecf.mongodb.net/';
const client = new MongoClient(url);
client.connect();


app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, color
    // outgoing: error
    const { userId, card } = req.body;
    const newCard = { Card: card, UserId: userId };
    console.log(`newcard.Card: ${newCard.card} newCard.UserId: ${newCard.userId}`);
    var error = '';
    try {
        const db = client.db("db");
        const result = db.collection('Cards').insertOne(newCard);
    }
    catch (e) {
        error = e.toString();
    }
    var ret = { error: error };
    res.status(200).json(ret);
});

app.post('/api/signup', async (req, res, next) => {
    // incoming: UserID, Password, FirstName, LastName
    // outgoing: error
    const { UserId, Login, Password, FirstName, LastName } = req.body;
    const newUser = { Login:Login, Password:Password, FirstName:FirstName, LastName:LastName, UserId: UserId };
    console.log(`newuser.login: ${newUser.Login} newUser.id: ${newUser.UserId}`);
    var error = '';
    try {
        const db = client.db("db");
        const result = db.collection('Users').insertOne(newUser);
    }
    catch (e) {
        error = e.toString();
    }
    var ret = { error: error };
    res.status(200).json(ret);
});


app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    var error = '';
    const { login, password } = req.body;
    const db = client.db("db");
    const results = await
        db.collection('Users').find({ email: login, password: password }).toArray();
    var id = -1;
    var fn = '';
    var ln = '';
    if (results.length > 0) {

        id = results[0].UserId;
        fn = results[0].FirstName;
        ln = results[0].LastName;
    }
    var ret = { id: id, firstName: fn, lastName: ln, error: '' };

    res.status(200).json(ret);
});
app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error
    var error = '';
    const { userId, search } = req.body;
    var _search = search.trim();
    console.log(`_search: ${_search}`)
    const db = client.db("db");
    const results = await db.collection('Cards').find({"Card":{$regex:_search}}).toArray();
    var _ret = [];
    for (var i = 0; i < results.length; i++) {
         _ret.push(results[i].Card);
         console.log(_ret[i]);
    }
    var ret = { results: _ret, error: error };
    res.status(200).json(ret);
});
