"use strict";
var MongoClient = require('mongodb').MongoClient;

module.exports = verify;

function verify(credentials, callback) {
    (async () => {
        var host = credentials.host;
        var port = credentials.port;
        var db = credentials.db;
        var login = credentials.login;
        var pass = credentials.pass;

        MongoClient.connect(`mongodb://${login}:${pass}@${host}:${port}/${db}`, function(err, db) {
            if(!err) {
            console.log("We are connected");

            callback(null, "OK")
            } else {
                console.log(err);
            }
        });
    }) ();
}