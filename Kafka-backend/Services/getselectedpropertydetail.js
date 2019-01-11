var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/HomeAway";
//const bcrypt = require('b');

var crypto = require("crypto");
function handle_request(msg, callback) {
  var res = {};
  console.log("In [property] details handle request:" + JSON.stringify(msg));
  mongo.myconnect(mongoURL, function() {
    console.log("Connected to mongo at: " + mongoURL);
    var coll = mongo.collection("HomeAway");
    console.log("inside mongo query");
    key = "273";
    var hash = crypto.createHmac("sha512", key); //encrytion using SHA512
    hash.update(msg.password);
    msg.password = hash.digest("hex");
    coll.update(
      { _id: msg.request.id },
      {
        $push: { Property: msg.request.property }
      },
      function(err, user) {
        if (user) {
          res.code = "200";
          res.value = user;
          console.log(user);
          console.log(res.value);
        } else {
          res.code = "400";
          res.value = "Failed to list property";
          console.log(res.value);
        }
        console.log("inside try:" + res);
        callback(null, res);
      }
    );
  });
}

exports.handle_request = handle_request;
