var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/HomeAway";
//const bcrypt = require('b');
var HomeAway = require("../model/homeaway");

var crypto = require("crypto");
function handle_request(msg, callback) {
  var res = {};
  console.log("In update profile handle request:" + JSON.stringify(msg));
  HomeAway.findOneAndUpdate(
    { "user.username": msg.profile.username },
    {
      $set: {
        "user.school": msg.profile.school,
        "user.phone": msg.profile.phone,
        "user.aboutMe": msg.profile.aboutMe,
        "user.company": msg.profile.company,
        "user.hometown": msg.profile.hometown,
        "user.languages": msg.profile.languages,
        "user.gender": msg.profile.gender,
        "user.city": msg.profile.city
        //   "user.country": msg.profile.country,
        //   "user.address": msg.address
      }
    },
    { new: true },
    function(err, result) {
      if (err) {
        res.code = "400";
        res.value = "Cannot update 'Profile' at the moment";
        console.log(res.value);
        callback(err, res);
      } else {
        res.code = "200";
        res.value = result;
        console.log(result);
        callback(null, res);
      }
    }
  );
}
exports.handle_request = handle_request;
