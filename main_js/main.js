

/* //// Main JS called after the app starts ////
 * This will handle all our required objects
 * and will setup our main modules services
 */

//// ▶▶ require objects ◀◀ ////

var bodyParser = require('body-parser');
var http = require('http');
var jwt = require('jsonwebtoken');

var config = require('./../config');  // get some of our configuration items
var sec=config.application.hashToken;

var db = require('../model/db'); // Setup our connections to the cb db

//// get our custom services ////
var auth=require('../model/authentication.js');  // Sets up our user login sessions
//var user=require('../model/user.js'); // This isn't required yet

/*
var airport=require('../model/airport');
var flightPath=require('../model/flightPath');
var rawImport=require('../model/raw/rawImport');
*/


//// ▶▶ application/json parser ◀◀ ////
var jsonParser = bodyParser.json();

//// ▶▶ application/x-www-form-urlencoded parser ◀◀ ////
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {

    //// ▶▶ enable cors ◀◀ ////
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });


    //// ▶▶ create login ◀◀ ////
    app.post('/api/user/login',jsonParser,function(req,res){
        auth.createLogin(req.body.user,req.body.password,function(err,done){
            if(err){
                res.status=400;
                res.send(err);
                return;
            }
            res.status=202;
            res.send(done);
            return;
        });
    });

    //// ▶▶ login ◀◀ ////
    app.get('/api/user/login',urlencodedParser,function(req,res){
        auth.login(req.query.user,req.query.password,function(err,check){
            if(err){
                res.status=400;
                res.send(err);
                return;
            }
            if(check){
                res.status=202;
                res.send(check);
                return;
            }
        });
    });

    //// ▶▶ provision ◀◀ ////
    app.post('/api/status/provisionCB',function(req,res){
        rawImport.provisionCB(function(err,done){
            if(err){
                res.status=400;
                res.send(err);
                return;
            }
            res.status=202;
            res.send(done);
            return;
        });
    });
}
