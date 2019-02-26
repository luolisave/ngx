const CONSTANTS = require('./const');

function getToken(req, res){
    let token = '';
    if(req.headers.token){
        token = req.headers.token;
        return token;
    }else if(req.params.token){
        token = req.params.token;
        return token;
    }else if(req.body && req.body.token){
        token = req.body.token;
        return token;
    }else{
        return false;
    }
}

function getPasscode(req, res){
    let passcode = '';
    if(req.headers.passcode){
        passcode = req.headers.passcode;
        return passcode;
    }else if(req.query.passcode){
        passcode = req.query.passcode;
        return passcode;
    }else if(req.params.passcode){
        passcode = req.params.passcode;
        return passcode;
    }else if(req.body && req.body.passcode){
        passcode = req.body.passcode;
        return passcode;
    }else{
        return false;
    }
}

function isloggedIn(req, res, db, dbX, options, executeFunctionAfterCheck){
    if(options && options.method === 'token'){
        console.log('auth: method is: token.');
        let timeDifference = 0;
        let currentUnixTime = Math.floor(new Date() / 1000);
        let token = getToken(req, res);
        db.users.findOne({ token: token }, function (err, doc) {
            // console.log('doc ======>', doc);
            if(doc){
                timeDifference = currentUnixTime - doc.tokenTime;
                if(timeDifference < CONSTANTS.USER_LOGIN_TIMEOUT){
                    executeFunctionAfterCheck(req, res, dbX);
                }else{
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({ status: 0, info: 'auth: login expired.', data:{} }));
                }
            }else{
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({ status: 0, info: 'auth: not log in yet.', data:{} }));
            }
        });
    }else if(options && options.method === 'passcode'){
        let passcode = getPasscode(req, res);
        console.log('auth method is: passcode. CONSTANTS.PASSCODE=',CONSTANTS.PASSCODE);
        if(passcode && passcode === CONSTANTS.PASSCODE){
            executeFunctionAfterCheck(req, res, dbX);
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ status: 0, info: 'auth: wrong passcode.', data:{} }));
        }
    }else if(options && options.method === 'null'){
        console.log('auth method is: passcode.');
        executeFunctionAfterCheck(req, res, dbX);
    }else{
        console.log('auth method not select.');
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ status: 0, info: 'auth method not valid.', data:{} }));
    }
}

module.exports.isloggedIn = isloggedIn;