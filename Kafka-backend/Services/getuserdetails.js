var HomeAway = require("../model/homeaway");
//const bcrypt = require('b');

var crypto = require("crypto");
function handle_request(msg, callback) {
  var res = {};
  console.log("In get user details handle request:" + JSON.stringify(msg));
  HomeAway.findOne(
    { "user.username": msg.username },
    { user: 1, _id: 0 },
    function(err, user) {
      if (user) {
        res.code = "200";
        res.value = user;
        console.log(user);
        console.log(res.value);
      } else {
        res.code = "400";
        res.value = "Could not find User";
        console.log(res.value);
      }

      callback(null, res);
    }
  );
}

exports.handle_request = handle_request;
