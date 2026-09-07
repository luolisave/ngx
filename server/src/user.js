const hasha = require('hasha');
const randomstring = require("randomstring");
const dbHelper = require('./db');

function login(req, res, db){
    let userLogin = req.body;
    userLogin.password = hasha(userLogin.password);

    // LMDB native lookup: find the user doc by username, then verify password.
    const doc = dbHelper.findOne(db.users, { username: userLogin.username });
    if(doc && doc.password === userLogin.password){
        doc.token = randomstring.generate();
        doc.tokenTime = Math.floor(new Date() / 1000);
        doc.updateDate = new Date();
        db.users.putSync(doc._id, doc);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ status: 1, info: 'Success: retrieve user successfully!', data:doc }));
    }else{
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ status: 0, info: 'Error: Check your username and password and try again!', data:{} }));
    }
}

function appRoute(app, db){
    app.post('/api/v1/user/login', (req, res) => {
        login(req, res, db);
    });
}

module.exports.appRoute = appRoute;
module.exports.login = login;