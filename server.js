const express = require('express');
const nodemailer = require("nodemailer");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { error } = require('console');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();
app.set('port', (process.env.PORT || 5000));

if (process.env.NODE_ENV === 'production'){
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) =>{
        if(req.path == '/api/verify')
            res.redirect(req.originalUrl);
        else
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
        results = results[0];
        if(results["verified"] == 1){
            ret["info"] = results;
            id = 1;
        }
        else{
            error = "Email Has Not Been Verified"
        }
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
    const newUser = { "firstName": firstName, "lastName": lastName, "email": email, "password": password, "tracked": {}, "verified": 0};
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
            await db.collection('users').insertOne(newUser);
            newConsumed = {userId: id+1, dates: {}};
            await db.collection('consumed').insertOne(newConsumed);

            let smtpTransport = nodemailer.createTransport({
                host: 'smtp.zoho.com',
                secure: true,
                auth: {
                    user: "finalfitness@zohomail.com",
                    pass: "Ai4K88AVjgwB"
                }
            });
            let mailOptions,host,link;
            id = id + 1;
            host=req.get('host');
            link="http://"+req.get('host')+"/api/verify?id="+id;
            mailOptions={
                to : email,
                from: "finalfitness@zohomail.com",
                subject : "Please confirm your Email account",
                //html : 'Hello,<br> Please Click on the link to verify your email.<br><form method="post" action="'+link+'" novalidate><input type="hidden" name="extra_submit_param" value="extra_submit_value"><button type="submit" name="submit_param" value="submit_value" class="link-button">Click here to verify</button></form>' 
                html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                    console.log(error);
                res.end("error");
            }else{
                    console.log("Message sent: " + response.message);
                res.end("sent");
                }
            });
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

app.get('/api/verify', async (req, res, next) => {
    //const {userId} = req.body;
    console.log("hey");
    try{
        let userId = Number(req.query.id);
        const db = client.db("FinalFitness");
        let temp = await db.collection("users").updateOne(
            {"id": userId},
            {$set: {"verified": 1}}
        );
        res.end("<h1>Your Email Has Been Successfully Verified");
    }
    catch(e){
        res.end("<p>"+e.toString()+"</p>");
    }
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

app.post('/api/addConsumedItem', async (req, res, next) => {
    const { userId, date, item } = req.body;
    let field = "dates."+date;
    let error = "";
    let id = 1;
    let info = {};
    try{
        const db = client.db("FinalFitness");
        await db.collection("consumed").updateOne(
            {"userId": userId},
            {$push: {[field]: item}}
        )
        info = await db.collection("consumed").find({"userId": userId}).toArray();
        info = info[0];
    }
    catch(e){
        error = e.toString();
        id = -1;
    }
    let ret = {"id": id, "error": error, "info": info};
    res.status(200).json(ret);
});

app.post('/api/updateTracked', async (req, res, next) => {
    const { userId, tracked } = req.body;
    let error = "";
    let id = 1;
    let info = {};
    try{
        const db = client.db("FinalFitness");
        await db.collection("users").updateOne(
            {"id": userId},
            {$set: {"tracked": tracked}}
        )
        info = await db.collection("users").find({"id": userId}).toArray();
        info = info[0];
    }
    catch(e){
        error = e.toString();
        id = -1;
    }
    let ret = {"id": id, "error": error, "info": info};
    res.status(200).json(ret);
});

app.listen(PORT, () =>{
    console.log('Server listening on port ' + PORT);
});