const path = require('path');
const lmdb = require('lmdb');

// Single LMDB environment (directory) with named sub-databases.
// Each document is stored under its `_id` key, serialized as JSON.
const envPath = path.join(__dirname, '..', 'private', 'lmdb');

const root = lmdb.open(envPath, {
    encoding: 'json',   // store/retrieve docs as JSON, so values come back as plain objects
    maxDbs: 10
});

function openStore(name) {
    return root.openDB({
        name,
        encoding: 'json'
    });
}

const stores = {
    users: openStore('users'),
    userInfo: openStore('userInfo'),
    pages: openStore('pages'),
    mocks: openStore('mocks')
};

/**
 * Returns the first document matching the query object (AND semantics).
 * LMDB offers fast primary-key lookup, so when the query is `{ _id: <value> }`
 * we do a direct get; otherwise we scan the (small) store.
 */
function findOne(dbX, query) {
    if (query && Object.keys(query).length === 1 && query._id !== undefined) {
        return dbX.get(query._id) || null;
    }
    const q = query || {};
    for (const { key, value } of dbX.getRange()) {
        let matched = true;
        for (const k of Object.keys(q)) {
            if (JSON.stringify(value[k]) !== JSON.stringify(q[k])) {
                matched = false;
                break;
            }
        }
        if (matched) return value;
    }
    return null;
}

/**
 * Returns all documents matching the query object (AND semantics).
 * An empty/absent query returns every document in the store.
 */
function find(dbX, query) {
    const q = query || {};
    const results = [];
    for (const { value } of dbX.getRange()) {
        let matched = true;
        for (const k of Object.keys(q)) {
            if (JSON.stringify(value[k]) !== JSON.stringify(q[k])) {
                matched = false;
                break;
            }
        }
        if (matched) results.push(value);
    }
    return results;
}

// Injectable / external modules can also grab the raw stores if needed.
module.exports = { root, stores, findOne, find };