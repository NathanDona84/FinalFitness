const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const MongoClient = require('mongodb').MongoClient;
const url ='mongodb+srv://COP4331:%40COP4331bestgroup@cluster0.3oshecf.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(url);
client.connect();

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

app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error
    let error = '';
    const { email, password } = req.body;
    try{
        const db = client.db("FinalFitness");
        var results = await db.collection('users').find({ email: email, password: password }).toArray();
    }
    catch(e) {
        error = e.toString();
    }

    let id = -1;
    let fn = '';
    let ln = '';
    if (results.length > 0) {
        id = results[0]['id'];
        fn = results[0]['firstName'];
        ln = results[0]['lastName'];
    }
    let ret = { id: id, firstName: fn, lastName: ln, error: '' };
    res.status(200).json(ret);
});

app.post('/api/register', async (req, res, next) => {
    // incoming: UserID, Password, FirstName, LastName
    // outgoing: error
    const { firstName, lastName, email, password } = req.body;
    const newUser = { "firstName": firstName, "lastName": lastName, "email": email, "password": password, "tracked": {}};
    let error = '';
    let inserted = 1;
    try {
        const db = client.db("FinalFitness");
        let temp = await db.collection('users').find({"email": email}).toArray();
        if(temp.length > 0){
            inserted = -1;
            error = 'email already exists';
        }
        else{
            let id = await db.collection('users').find().sort({"id": -1}).limit(1).toArray();
            id = id[0]["id"];
            newUser["id"] = id+1;
            const result = db.collection('users').insertOne(newUser);
        }
    }
    catch(e){
        inserted = -1;
        error = e.toString();
    }
    //console.log(newUser);
    let ret = {inserted: inserted, error: error};
    res.status(200).json(ret);
});


app.listen(5000);