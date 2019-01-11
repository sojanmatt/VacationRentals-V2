var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/HomeAway";
//const bcrypt = require('b');
var HomeAway = require("../model/homeaway");

function handle_request(msg, callback) {
  var res = {};
  console.log("In Owner Dashboard handle request:" + JSON.stringify(msg));

  var pipeline = [
    // Initial document match (uses index, if a suitable one is available)
    {
      $match: {
        "user.username": {
          $eq: msg.username
        }
      }
    },
    {
      $project: {
        properties: "$properties",
        _id: 0
      }
    },

    // Expand the scores array into a stream of documents
    { $unwind: "$properties" },

    {
      $sort: {
        "properties.prop_id": -1
      }
    }
  ];
  var promise = HomeAway.aggregate(pipeline).exec();
  promise
    .then(function(data) {
      console.log("owner dashboard data-");
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
