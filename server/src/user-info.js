const fs = require('fs');
const jsonSize = require('json-size');

const auth = require('./auth');
const dbHelper = require('./db');
const CONSTANTS = require('./const');

const STORE = 'userInfo';

function send(res, obj) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(obj));
}

function isAdmin(user) {
    return !!(user && user.role === 'admin');
}

// Admin must explicitly opt into cross-user access via ?all=true.
// Without the flag, even admin only sees their own doc.
function wantsAll(req) {
    const v = req.query && req.query.all;
    if (v === undefined || v === null) return false;
    return ['true', '1', 'all', 'yes'].includes(String(v).toLowerCase());
}

function canAccessAll(req, currentUser) {
    return isAdmin(currentUser) && wantsAll(req);
}

function forbidden(res, what) {
    return send(res, { status: 0, info: `Error: forbidden, you can only access your own user information${what ? ' (' + what + ')' : ''}. Admins add ?all=true to access all.`, data: {} });
}

function IsJsonString(str) {
    try { JSON.parse(str); } catch (e) { return false; }
    return true;
}

function stripBulk(body) {
    const copy = body ? JSON.parse(JSON.stringify(body)) : {};
    let bulkData;
    if (copy && copy.___bulk !== undefined) {
        bulkData = copy.___bulk;
        delete copy.___bulk;
    }
    return { copy, bulkData };
}

function saveBulk(xId, bulkData) {
    let bulkFilePath = `./private/uploads/___bulks/${xId}.json`;
    let bulkDataStr = typeof bulkData === 'object' ? JSON.stringify(bulkData) : String(bulkData);
    fs.writeFileSync(bulkFilePath, bulkDataStr);
    return bulkFilePath;
}

function loadBulk(doc) {
    if (!doc) return doc;
    let bulkFilePath = `./private/uploads/___bulks/${doc._id}.json`;
    if (fs.existsSync(bulkFilePath)) {
        const data = fs.readFileSync(bulkFilePath).toString();
        doc.___bulk = data;
        if (IsJsonString(doc.___bulk)) doc.___bulk = JSON.parse(doc.___bulk);
    }
    return doc;
}

// POST /api/v1/user-info/create — creates the caller's own doc (_id = user _id). 1-to-1.
function create(req, res, db) {
    auth.isloggedIn(req, res, db, db[STORE], { method: 'token' }, (req, res, dbX, currentUser) => {
        const ownId = currentUser._id;
        if (dbX.get(ownId)) {
            return send(res, { status: 0, info: 'Error: user information already exists, use PATCH /api/v1/user-info/:xId to update.', data: {} });
        }
        const { copy, bulkData } = stripBulk(req.body);
        // Never allow client to forge ownership or auth fields.
        delete copy._id;
        delete copy.token;
        delete copy.tokenTime;
        delete copy.password;
        delete copy.username;
        delete copy.role;
        const doc = Object.assign({}, copy, { _id: ownId, createDate: new Date(), updateDate: new Date() });
        if (jsonSize(doc) >= CONSTANTS.PAGE_DOC_BYTES_LIMIT) {
            return send(res, { status: 0, info: `Error: exceeding document limits. Document size must less than ${CONSTANTS.PAGE_DOC_BYTES_LIMIT} bytes. Change const.js PAGE_DOC_BYTES_LIMIT to increase the limits.`, data: {} });
        }
        try {
            dbX.putSync(ownId, doc);
            if (bulkData !== undefined) saveBulk(ownId, bulkData);
            send(res, { status: 1, info: 'Success: user information created.', data: loadBulk(Object.assign({}, doc)) });
        } catch (e) {
            send(res, { status: 0, info: 'Error: ' + e.message, data: {} });
        }
    });
}

// GET /api/v1/user-info/list[?all=true] — own doc by default; all docs for admin+?all=true.
function list(req, res, db) {
    auth.isloggedIn(req, res, db, db[STORE], { method: 'token' }, (req, res, dbX, currentUser) => {
        try {
            if (canAccessAll(req, currentUser)) {
                const docs = dbHelper.find(dbX).map(loadBulk);
                return send(res, { status: 1, info: 'Success: user information retrieved (all).', data: docs });
            }
            const own = dbX.get(currentUser._id);
            const docs = own ? [loadBulk(Object.assign({}, own))] : [];
            return send(res, { status: 1, info: 'Success: user information retrieved.', data: docs });
        } catch (e) {
            send(res, { status: 0, info: 'Error: ' + e.message, data: {} });
        }
    });
}

// GET /api/v1/user-info/:xId
function getOne(req, res, db) {
    auth.isloggedIn(req, res, db, db[STORE], { method: 'token' }, (req, res, dbX, currentUser) => {
        if (!req.params || req.params.xId === undefined) {
            return send(res, { status: 0, info: 'Error: id not provided.', data: {} });
        }
        if (!canAccessAll(req, currentUser) && req.params.xId !== currentUser._id) {
            return forbidden(res, `_id = ${req.params.xId}`);
        }
        const doc = dbX.get(req.params.xId);
        if (doc) {
            send(res, { status: 1, info: 'Success: user information retrieved.', data: loadBulk(Object.assign({}, doc)) });
        } else {
            send(res, { status: 0, info: 'Error: cannot find user information!', data: {} });
        }
    });
}

// PATCH /api/v1/user-info/:xId — upsert: updates if exists, else creates.
function update(req, res, db) {
    auth.isloggedIn(req, res, db, db[STORE], { method: 'token' }, (req, res, dbX, currentUser) => {
        if (!req.params || req.params.xId === undefined) {
            return send(res, { status: 0, info: 'Error: id not provided.', data: {} });
        }
        if (!canAccessAll(req, currentUser) && req.params.xId !== currentUser._id) {
            return forbidden(res, `_id = ${req.params.xId}`);
        }
        const existing = dbX.get(req.params.xId) || null;
        const { copy, bulkData } = stripBulk(req.body);
        delete copy._id;
        delete copy.token;
        delete copy.tokenTime;
        delete copy.password;
        delete copy.username;
        delete copy.role;
        const now = new Date();
        copy.updateDate = now;
        const merged = Object.assign({}, existing || {}, copy, { _id: req.params.xId });
        if (!existing) {
            merged.createDate = now;
        }
        if (jsonSize(merged) >= CONSTANTS.PAGE_DOC_BYTES_LIMIT) {
            return send(res, { status: 0, info: `Error: exceeding document limits. Document size must less than ${CONSTANTS.PAGE_DOC_BYTES_LIMIT} bytes. Change const.js PAGE_DOC_BYTES_LIMIT to increase the limits.`, data: {} });
        }
        try {
            dbX.putSync(req.params.xId, merged);
            if (bulkData !== undefined) saveBulk(req.params.xId, bulkData);
            send(res, { status: 1, info: existing ? `Success: user information updated (_id = ${req.params.xId}).` : `Success: user information created (_id = ${req.params.xId}).`, data: loadBulk(Object.assign({}, merged)) });
        } catch (e) {
            send(res, { status: 0, info: 'Error: ' + e.message, data: {} });
        }
    });
}

// DELETE /api/v1/user-info/:xId
function remove(req, res, db) {
    auth.isloggedIn(req, res, db, db[STORE], { method: 'token' }, (req, res, dbX, currentUser) => {
        if (!req.params || req.params.xId === undefined) {
            return send(res, { status: 0, info: 'Error: id not provided.', data: {} });
        }
        if (!canAccessAll(req, currentUser) && req.params.xId !== currentUser._id) {
            return forbidden(res, `_id = ${req.params.xId}`);
        }
        const existed = dbX.get(req.params.xId);
        if (!existed) {
            return send(res, { status: 0, info: 'Error: user information not found.', data: {} });
        }
        dbX.removeSync(req.params.xId);
        let bulkFilePath = `./private/uploads/___bulks/${req.params.xId}.json`;
        if (fs.existsSync(bulkFilePath)) fs.unlinkSync(bulkFilePath);
        send(res, { status: 1, info: 'Success: user information removed.', data: {} });
    });
}

function appRoute(app, db) {
    app.post('/api/v1/user-info/create', (req, res) => create(req, res, db));
    app.get('/api/v1/user-info/list', (req, res) => list(req, res, db));
    app.get('/api/v1/user-info/:xId', (req, res) => getOne(req, res, db));
    app.patch('/api/v1/user-info/:xId', (req, res) => update(req, res, db));
    app.delete('/api/v1/user-info/:xId', (req, res) => remove(req, res, db));
}

module.exports.appRoute = appRoute;
module.exports.create = create;
module.exports.list = list;
module.exports.getOne = getOne;
module.exports.update = update;
module.exports.remove = remove;
