var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/HomeAway";
var HomeAway = require("../model/homeaway");
//const bcrypt = require('b');

//var crypto = require("crypto");
function handle_request(msg, callback) {
  console.log("property", msg.property.property);
  var res = {};
  console.log("In Book property handle request:" + JSON.stringify(msg));
  HomeAway.findOne(
    { "properties.prop_id": msg.property.property.prop_id },
    {
      _id: 0,
      properties: { $elemMatch: { prop_id: msg.property.property.prop_id } }
    },
    function(err, user) {
      if (err) {
        res.code = "400";
        res.value = "Could not Book Property";
        console.log(res.value);
        // res.code = "200";
        // res.value = user;
        // console.log(user);
        // console.log(res.value);
      } else {
        // res.code = "200";
        res.value = user;
        // console.log(user);
        console.log("valueof property is", res.value);

        HomeAway.findOneAndUpdate(
          { "user.username": msg.property.property.username },
          {
            $push: {
              bookings: {
                properties: res.value.properties,
                fromDate: msg.property.property.startdate,
                toDate: msg.property.property.enddate
              }
            }
          },
          function(err, result) {
            if (err) {
              res.code = "400";
              res.value = "Could not Book Property";
              console.log(res.value);
              // res.code = "200";
              // res.value = user;
              // console.log(user);
              // console.log(res.value);
            } else {
              res.code = "200";
              res.value = result;
              console.log(result);
              console.log("valueof booked property is", res.value);
            }
          }
        );
      }

      callback(null, res);
    }
  );
}

exports.handle_request = handle_request;
