var HomeAway = require("../model/homeaway");
//const bcrypt = require('b');

//var crypto = require("crypto");
function handle_request(msg, callback) {
  var res = {};
  console.log("In get all questions request:" + JSON.stringify(msg));

  var pipeline = [
    { $unwind: "$messages" },
    { $match: { "messages.travelername": msg.messages.username } },
    { $sort: { "messages.message_id": -1 } },
    { $group: { _id: "$messages.prop_id", messages: { $push: "$messages" } } },
    { $project: { _id: 0, messages: 1 } }
  ];
  var promise = HomeAway.aggregate(pipeline).exec();
  promise
    .then(function(data) {
      console.log("inbox messages data-");
      console.log(data);
      res.value = data;
      if (data) {
        res.code = 200;
        callback(null, res);
      }
    })
    .catch(function(err) {
      // just need one of these
      console.log("error:", err.message);
      res.code = "400";
      callback(err, res);
    });
}

exports.handle_request = handle_request;
