const crud = require('./crud');
const dbHelper = require('./db');
const currentDB = 'mocks';

function appRoute(app, db){

    // mock business starts =========================================================================================
    app.patch('/mock/business', (req, res) => {
        const mockDB = db['mocks'];
        const doc = dbHelper.findOne(mockDB, { _id: '1lcyijBFZdahhXpQ' });
        if(doc){
            res.setHeader('Content-Type', 'application/json');
            doc.modify = 'modified according to business';
            res.send(JSON.stringify(doc));
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({err:null,doc:null}));
        }
    });

    
    // mock doc management. ===================================================================
    app.get('/mock/list', (req, res) => {
        let promise = crud.listX(req, res, db, db[currentDB], {method:'null'});
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

    app.get('/mock/:xId', (req, res) => {
        let promise = crud.getX(req, res, db, db[currentDB], {method:'null'});
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

    app.post('/mock/create', (req, res) => {
        let promise = crud.createX(req, res, db, db[currentDB], {method:'null'});
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

    app.patch('/mock/:xId', (req, res) => {
        let promise = crud.updateX(req, res, db, db[currentDB], {method:'null'});
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

    app.delete('/mock/:xId', (req, res) => {
        crud.delX(req, res, db, db.mocks, {method:'null'});
        let promise = crud.delX(req, res, db, db[currentDB], {method:'null'});
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