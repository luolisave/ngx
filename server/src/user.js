const hasha = require('hasha');
const randomstring = require("randomstring");

function login(req, res, db){
    // console.log('==========> auth.login(); /api/v1/user/login');
    // console.log('req.params = ', req.params);
    // console.log('req.body = ', req.body);

    let userLogin = req.body;
    userLogin.password = hasha(userLogin.password); // TODO:  check both username and password.
    // console.log('---userLogin', userLogin);
    db.users.findOne({ username: userLogin.username, password: userLogin.password }, function (err, doc) {
        if(doc){
            doc.token = randomstring.generate();
            doc.tokenTime = Math.floor(new Date() / 1000);
            doc.updateDate = new Date();
            db.users.update({username: userLogin.username}, doc, {}, function(err, numReplaced, affectedDocuments){
                // console.log('update token. err = ', err, 'numReplaced = ', numReplaced, ' affectedDocuments = ', affectedDocuments);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ status: 1, info: 'Success: retrieve user successfully!', data:doc }));
            });
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ status: 0, info: 'Error: Check your username and password and try again!', data:{} }));
        }
    });
}

function appRoute(app, db){
    app.post('/api/v1/user/login', (req, res) => {
        login(req, res, db);
    });
}

module.exports.appRoute = appRoute;
module.exports.login = login;