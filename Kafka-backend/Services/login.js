var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/HomeAway";
const bcrypt = require("bcrypt");

//var crypto = require("crypto");
function handle_request(msg, callback) {
  var res = {};
  console.log("In traveler login handle request:" + JSON.stringify(msg));
  mongo.myconnect(mongoURL, function() {
    console.log("Connected to mongo at: " + mongoURL);
    var coll = mongo.collection("HomeAway");
    console.log("inside mongo query");
    // key = "273";
    //  var hash = crypto.createHmac("sha512", key); //encrytion using SHA512
    //  hash.update(msg.password);
    //    msg.password = hash.digest("hex");
    console.log(msg.password);
    coll.findOne({ "user.username": msg.username }, function(err, user) {
      console.log("result is ", JSON.stringify(user));
      console.log("Body is  " + msg.password);
      bcrypt.compare(msg.password, user.user.password, function(err, answer) {
        console.log("answer is " + JSON.stringify(answer));
        if (answer) {
          res.code = "200";
          res.value = user;
          console.log(user);
          console.log(res.value);
          //    req.session.user = result;
          console.log("Successfully retrieving");
          console.log("res after succeful login", res);
          console.log("req.body.username", JSON.stringify(msg.username));
          callback(null, res);
          //   res.status(200).send(JSON.stringify(req.body.username));
          //   res.end("Successful Login");
        } else {
          res.code = "400";
          res.value = "Failed Login";
          console.log(res.value);
          callback(null, res);
        }
      });

      // if (user) {
      // res.code = "200";
      // res.value = user;
      // console.log(user);
      // console.log(res.value);
      //   } else {
      // res.code = "400";
      // res.value = "Failed Login";
      // console.log(res.value);
      //    }
      console.log("inside try:" + JSON.stringify(res));
  //    callback(null, res);
    });
  });
}

exports.handle_request = handle_request;
