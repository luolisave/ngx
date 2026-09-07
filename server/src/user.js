const hasha = require('hasha');
const randomstring = require("randomstring");
const auth = require('./auth');
const dbHelper = require('./db');

function sanitize(doc) {
    if (!doc) return doc;
    const copy = Object.assign({}, doc);
    delete copy.password;
    return copy;
}

function genId() {
    return randomstring.generate({
        length: 16,
        charset: 'alphanumeric'
    });
}

function send(res, obj) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(obj));
}

function login(req, res, db){
    const userLogin = req.body || {};
    if (!userLogin.username || !userLogin.password) {
        return send(res, { status: 0, info: 'Error: username and password are required.', data: {} });
    }
    const hashed = hasha(userLogin.password);

    // LMDB native lookup: find the user doc by username, then verify password.
    const doc = dbHelper.findOne(db.users, { username: userLogin.username });
    if(doc && doc.password === hashed){
        doc.token = randomstring.generate();
        doc.tokenTime = Math.floor(new Date() / 1000);
        doc.updateDate = new Date();
        db.users.putSync(doc._id, doc);
        send(res, { status: 1, info: 'Success: retrieve user successfully!', data: sanitize(doc) });
    }else{
        send(res, { status: 0, info: 'Error: Check your username and password and try again!', data:{} });
    }
}

function register(req, res, db) {
    auth.isloggedIn(req, res, db, db.users, { method: 'token' }, (req, res) => {
        const body = req.body || {};
        if (!body.username || !body.password) {
            return send(res, { status: 0, info: 'Error: username and password are required.', data: {} });
        }
        const existed = dbHelper.findOne(db.users, { username: body.username });
        if (existed) {
            return send(res, { status: 0, info: 'Error: username already exists.', data: {} });
        }
        const doc = {
            _id: body._id || genId(),
            username: body.username,
            password: hasha(body.password),
            role: body.role || 'user',
            createDate: new Date(),
            updateDate: new Date()
        };
        // copy over extra fields (e.g. displayName, email) but never client-supplied token
        for (const k of Object.keys(body)) {
            if (['_id', 'username', 'password', 'role', 'token', 'tokenTime'].includes(k)) continue;
            doc[k] = body[k];
        }
        if (db.users.get(doc._id)) {
            return send(res, { status: 0, info: 'Error: _id already exists.', data: {} });
        }
        db.users.putSync(doc._id, doc);
        send(res, { status: 1, info: 'Success: user registered.', data: sanitize(doc) });
    });
}

function list(req, res, db) {
    auth.isloggedIn(req, res, db, db.users, { method: 'token' }, (req, res) => {
        try {
            const docs = dbHelper.find(db.users).map(sanitize);
            send(res, { status: 1, info: 'Success: users retrieved.', data: docs });
        } catch (e) {
            send(res, { status: 0, info: 'Error: ' + e.message, data: {} });
        }
    });
}

function getOne(req, res, db) {
    auth.isloggedIn(req, res, db, db.users, { method: 'token' }, (req, res) => {
        if (!req.params || req.params.xId === undefined) {
            return send(res, { status: 0, info: 'Error: user id not provided.', data: {} });
        }
        const doc = dbHelper.findOne(db.users, { _id: req.params.xId });
        if (doc) {
            send(res, { status: 1, info: 'Success: user retrieved.', data: sanitize(doc) });
        } else {
            send(res, { status: 0, info: 'Error: cannot find user!', data: {} });
        }
    });
}

function update(req, res, db) {
    auth.isloggedIn(req, res, db, db.users, { method: 'token' }, (req, res) => {
        if (!req.params || req.params.xId === undefined) {
            return send(res, { status: 0, info: 'Error: user id not provided.', data: {} });
        }
        const existing = db.users.get(req.params.xId);
        if (!existing) {
            return send(res, { status: 0, info: 'Error: user not found.', data: {} });
        }
        const body = req.body ? JSON.parse(JSON.stringify(req.body)) : {};
        // never allow client to set token fields directly
        delete body.token;
        delete body.tokenTime;
        delete body._id;
        if (body.username && body.username !== existing.username) {
            const dup = dbHelper.findOne(db.users, { username: body.username });
            if (dup) {
                return send(res, { status: 0, info: 'Error: username already exists.', data: {} });
            }
        }
        if (body.password) {
            body.password = hasha(body.password);
        }
        body.updateDate = new Date();
        const merged = Object.assign({}, existing, body, { _id: req.params.xId });
        try {
            db.users.putSync(req.params.xId, merged);
            send(res, { status: 1, info: `Success: user updated (_id = ${req.params.xId}).`, data: sanitize(merged) });
        } catch (e) {
            send(res, { status: 0, info: 'Error: ' + e.message, data: {} });
        }
    });
}

function remove(req, res, db) {
    auth.isloggedIn(req, res, db, db.users, { method: 'token' }, (req, res) => {
        if (!req.params || req.params.xId === undefined) {
            return send(res, { status: 0, info: 'Error: user id not provided.', data: {} });
        }
        const existed = db.users.get(req.params.xId);
        if (!existed) {
            return send(res, { status: 0, info: 'Error: user not found.', data: {} });
        }
        db.users.removeSync(req.params.xId);
        send(res, { status: 1, info: 'Success: user removed.', data: {} });
    });
}

function appRoute(app, db){
    app.post('/api/v1/user/login', (req, res) => {
        login(req, res, db);
    });
    app.post('/api/v1/user/register', (req, res) => {
        register(req, res, db);
    });
    app.get('/api/v1/user/list', (req, res) => {
        list(req, res, db);
    });
    app.get('/api/v1/user/:xId', (req, res) => {
        getOne(req, res, db);
    });
    app.patch('/api/v1/user/:xId', (req, res) => {
        update(req, res, db);
    });
    app.delete('/api/v1/user/:xId', (req, res) => {
        remove(req, res, db);
    });
}

module.exports.appRoute = appRoute;
module.exports.login = login;
module.exports.register = register;
module.exports.list = list;
module.exports.getOne = getOne;
module.exports.update = update;
module.exports.remove = remove;