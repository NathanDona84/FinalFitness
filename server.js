const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();
app.set('port', (process.env.PORT || 5000));

if (process.env.NODE_ENV === 'production'){
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.MONGODB_URI);
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

    let results = [];
    let id = -1;
    try{
        const db = client.db("FinalFitness");
        results = await db.collection('users').find({ email: email, password: password }).toArray();
    }
    catch(e) {
        error = e.toString();
    }

    let ret = {}
    if (results.length > 0) {
        ret["info"] = results[0];
        id = 1;
    }
    else{
        error = "Email/Password Combination Incorrect"
    }
    ret["error"] = error;
    ret["id"] = id;
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
            db.collection('users').insertOne(newUser);
            newConsumed = {userId: id+1, dates: {}};
            db.collection('consumed').insertOne(newConsumed);
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

app.post('/api/fetchConsumed', async (req, res, next) => {
    const { userId, date } = req.body;
    let error = "";
    let ret = {};
    try {
        const db = client.db("FinalFitness");
        let temp = await db.collection('consumed').find({"userId": userId}).toArray();
        if(temp.length == 0){
            error = 'could not find consumed object';
        }
        else{
            temp = temp[0];
            if(!Object.keys(temp["dates"]).includes(date)){
                temp["dates"][date]=[];
                await db.collection("consumed").updateOne(
                    {"userId": userId},
                    {$set: {"dates": temp["dates"]}}
                )
            }
            ret["info"] = temp;
        }
    }
    catch(e){
        error = e.toString();
    }
    //console.log(newUser);
    ret["error"] = error;
    res.status(200).json(ret);
});

app.listen(PORT, () =>{
    console.log('Server listening on port ' + PORT);
});