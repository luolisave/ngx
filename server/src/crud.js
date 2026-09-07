const fs = require('fs');
const jsonSize = require('json-size');
const randomstring = require('randomstring');

const auth = require('./auth');
const dbHelper = require('./db');
const CONSTANTS = require('./const');

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Generates a unique `_id` for new documents (LMDB keys just need to be
// unique within their collection).
function genId() {
    return randomstring.generate({
        length: 16,
        charset: 'alphanumeric'
    });
}

function listX(req, res, db, dbX, options){
    let promise = new Promise(function(resolve, reject) {
        auth.isloggedIn(req, res, db, dbX, options, function(req, res, dbX){
            try {
                const docs = dbHelper.find(dbX);
                resolve({ status: 1, info: 'Success: document retrieved.', data: docs });
            } catch (e) {
                reject({ status: 0, info: 'Error: ' + e.message, data: {} });
            }
        });
    });
    return promise;
}

function getX(req, res, db, dbX, options){
    let promise = new Promise(function(resolve, reject) {
        auth.isloggedIn(req, res, db, dbX, options, function(req, res, dbX){
            if(req.params && req.params.xId !== undefined){
                const doc = dbHelper.findOne(dbX, { _id: req.params.xId });
                if(doc){
                    let bulkFilePath = `./private/uploads/___bulks/${req.params.xId}.json`;
                    if (fs.existsSync(bulkFilePath)) {
                        const data = fs.readFileSync(bulkFilePath);
                        doc.___bulk = data.toString();
                        if(IsJsonString(doc.___bulk)){
                            doc.___bulk = JSON.parse(doc.___bulk);
                        }
                    }
                    resolve({ status: 1, info: 'Success: document retrieved.', data: doc });
                }else{
                    reject({ status: 0, info: 'Error: cannot find document!', data:{} });
                }
            }else{
                reject({ status: 0, info: 'xId not exist!', data:{} });
            }
        });
    });
    return promise;
}

function createX(req, res, db, dbX, options){
    let promise = new Promise(function(resolve, reject) {
        auth.isloggedIn(req, res, db, dbX, options, function(req, res, dbX){
            let pageObj = req.body ? JSON.parse(JSON.stringify(req.body)) : {};
            let bulkData = undefined;
            let jsonSizeInBytes = 0;

            if(pageObj && pageObj.___bulk){
                bulkData = pageObj.___bulk;
                delete pageObj.___bulk;
            }

            jsonSizeInBytes = jsonSize(pageObj);
            if(jsonSizeInBytes < CONSTANTS.PAGE_DOC_BYTES_LIMIT){
                if(!pageObj._id){
                    pageObj._id = genId();
                }
                try {
                    dbX.putSync(pageObj._id, pageObj);  // synchronous native LMDB write
                    if(bulkData){
                        let bulkFilePath = `./private/uploads/___bulks/${pageObj._id}.json`;
                        let bulkDataStr = '';
                        if(typeof bulkData === 'object'){
                            bulkDataStr = JSON.stringify(bulkData)
                        }else{
                            bulkDataStr = bulkData;
                        }
                        fs.writeFileSync(bulkFilePath, bulkDataStr);
                        resolve({ status: 1, info: `Success: new doc inserted (with ___bulk into ${bulkFilePath}).`, data: pageObj });
                    }else{
                        resolve({ status: 1, info: 'Success: new doc inserted.', data: pageObj });
                    }
                } catch (e) {
                    reject({ status: 0, info: 'Error: page not inserted: ' + e.message, data: {} });
                }
            }else{
                reject({ status: 0, info: `Error: exceeding document limits. Document size must less than ${CONSTANTS.PAGE_DOC_BYTES_LIMIT} bytes. Change const.js PAGE_DOC_BYTES_LIMIT to increase the limits.`, data:{} });
            }
        });
    });
    return promise;
}

function updateX(req, res, db, dbX, options){
    let promise = new Promise(function(resolve, reject) {
        auth.isloggedIn(req, res, db, dbX, options, function(req, res, dbX){
            let pageObj = req.body ? JSON.parse(JSON.stringify(req.body)) : {};

            if(req.params && req.params.xId !== undefined) {
                let jsonSizeInBytes = 0;
                let bulkData = undefined;

                if(pageObj && pageObj.___bulk){
                    bulkData = pageObj.___bulk;
                    delete pageObj.___bulk;
                }

                jsonSizeInBytes = jsonSize(pageObj);
                if(jsonSizeInBytes < CONSTANTS.PAGE_DOC_BYTES_LIMIT) {
                    const existing = dbX.get(req.params.xId);
                    if(existing){
                        const merged = Object.assign({}, existing, pageObj, { _id: req.params.xId });
                        try {
                            dbX.putSync(req.params.xId, merged);
                            if(bulkData){
                                let bulkFilePath = `./private/uploads/___bulks/${req.params.xId}.json`;
                                let bulkDataStr = '';
                                if(typeof bulkData === 'object'){
                                    bulkDataStr = JSON.stringify(bulkData)
                                }else{
                                    bulkDataStr = bulkData;
                                }
                                fs.writeFileSync(bulkFilePath, bulkDataStr);
                                resolve({ status: 1, info: `Success: 1 record updated with bulk (_id = ${req.params.xId}).`, data: 1 });
                            }else{
                                resolve({ status: 1, info: `Success: 1 record updated (_id = ${req.params.xId}).`, data: 1 });
                            }
                        } catch (e) {
                            reject({ status: 0, info: 'Error: ' + e.message, data: undefined });
                        }
                    }else{
                        reject({ status: 0, info: 'Error: document not found for update.', data: undefined });
                    }
                }else{
                    reject({ status: 0, info: `Error: exceeding document limits. Document size must less than ${CONSTANTS.PAGE_DOC_BYTES_LIMIT} bytes. Change const.js PAGE_DOC_BYTES_LIMIT to increase the limits.`, data:{} });
                }
            }else{
                reject({ status: 0, info: 'Error: document id not provided.', data:undefined });
            }
        });
    });
    return promise;
}

function delX(req, res, db, dbX, options){
    let promise = new Promise(function(resolve, reject) {
        auth.isloggedIn(req, res, db, dbX, options, function(req, res, dbX){
            if(req.params && req.params.xId !== undefined) {
                const existed = dbX.get(req.params.xId);
                if(existed){
                    dbX.removeSync(req.params.xId);
                    let bulkFilePath = `./private/uploads/___bulks/${req.params.xId}.json`;
                    if (fs.existsSync(bulkFilePath)) {
                        fs.unlinkSync(bulkFilePath);
                    }
                    resolve({ status: 1, info: 'Success: 1 line(s) removed.', data: {} });
                }else{
                    reject({ status: 0, info: 'Error: document not found.', data: {} });
                }
            }else{
                reject({ status: 0, info: 'Error: page id not provided.', data:{} });
            }
        });
    });
    return promise;
}

module.exports.getX = getX;
module.exports.listX = listX;
module.exports.createX = createX;
module.exports.updateX = updateX;
module.exports.delX = delX;