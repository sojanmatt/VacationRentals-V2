var HomeAway = require("../model/homeaway");
//const bcrypt = require('b');

//var crypto = require("crypto");
function handle_request(msg, callback) {
  var res = {};
  console.log("In ask a question request:" + JSON.stringify(msg));
  HomeAway.findOneAndUpdate(
    { "user.username": msg.messages.username },
    {
      $push: {
        messages: {
          message_id: new Date(),
          prop_id: msg.messages.prop_id,
          message: msg.messages.message,
          travelername: msg.messages.username
        }
      }
    },

    { new: true },
    function(err, user) {
      if (user) {
        res.code = "200";
        res.value = user;
        console.log(user);
        console.log(res.value);
      } else {
        res.code = "400";
        res.value = "Could not post message";
        console.log(res.value);
      }

      callback(null, res);
    }
  );
}

exports.handle_request = handle_request;
