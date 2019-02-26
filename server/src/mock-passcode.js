const crud = require('./crud');
const currentDB = 'mocks';

function appRoute(app, db){
    app.get('/api/v1/mock/list', (req, res) => {
        let promise = crud.listX(req, res, db, db[currentDB], {method:'passcode'});
        promise.then(
            function(result){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            },
            function(err){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(err));
            });
    });

    app.get('/api/v1/mock/:xId', (req, res) => {
        let promise = crud.getX(req, res, db, db[currentDB], {method:'passcode'});
        console.log('---mock');
        promise.then(
            function(result){
                console.log('---',result);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            },
            function(err){
                console.log('---',err);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(err));
            });
    });

    app.post('/api/v1/mock/create', (req, res) => {
        let promise = crud.createX(req, res, db, db[currentDB], {method:'passcode'});
        promise.then(
            function(result){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            },
            function(err){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(err));
            });
    });

    app.patch('/api/v1/mock/:xId', (req, res) => {
        let promise = crud.updateX(req, res, db, db[currentDB], {method:'passcode'});
        promise.then(
            function(result){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            },
            function(err){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(err));
            });
    });


    app.delete('/api/v1/mock/:xId', (req, res) => {
        crud.delX(req, res, db, db.mocks, {method:'passcode'});
        let promise = crud.delX(req, res, db, db[currentDB], {method:'passcode'});
        promise.then(
            function(result){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(result));
            },
            function(err){
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(err));
            });
    });
}

module.exports.appRoute = appRoute;