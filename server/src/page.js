const crud = require('./crud');
const currentDB = 'pages';

function appRoute(app, db){
    app.post('/api/v1/page/create', (req, res) => {
        let promise = crud.createX(req, res, db, db[currentDB], {method:'token'});
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

    app.get('/api/v1/page/list', (req, res) => {
        let promise = crud.listX(req, res, db, db[currentDB], {method:'token'});
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

    app.patch('/api/v1/page/:xId', (req, res) => {
        let promise = crud.updateX(req, res, db, db[currentDB], {method:'token'});
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

    app.get('/api/v1/page/:xId', (req, res) => {
        let promise = crud.getX(req, res, db, db[currentDB], {method:'token'});
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

    app.delete('/api/v1/page/:xId', (req, res) => {
        let promise = crud.delX(req, res, db, db[currentDB], {method:'token'});
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