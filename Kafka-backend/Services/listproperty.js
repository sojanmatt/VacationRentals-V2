var HomeAway = require("../model/homeaway");

function handle_request(msg, callback) {
  var res = {};
  console.log("list property params", msg);
  var pipeline = [
    { $unwind: "$properties" },
    {
      $sort: {
        "properties.prop_id": -1
      }
    },
    { $limit: 1 }
  ];
  var promise = HomeAway.aggregate(pipeline).exec();

  // promise
  //   .then(function(data) {
  //     console.log("max prop id-");
  //     console.log(data[0].properties.prop_id);
  //     res.value = data;
  //     if (data) {
  //       res.code = 200;
  //       callback(null, res);
  //     }
  //   })
  //   .catch(function(err) {
  //     // just need one of these
  //     console.log("error:", err.message);
  //     res.code = "400";
  //     callback(err, res);
  //   });
  promise
    .then(function(data) {
      console.log("list property data-");
      console.log(data);
      res.value = data;
      if (data) {
        var myObj = {
          prop_id: data[0].properties.prop_id + 1,
          headline: msg.property.property.headline,
          type: msg.property.property.type,
          location: msg.property.property.location,
          bed: msg.property.property.bed,
          bath: msg.property.property.bath,
          startdate: msg.property.property.startdate,
          enddate: msg.property.property.enddate,
          currencytype: msg.property.property.currencytype,
          rate: msg.property.property.rate,
          minstay: msg.property.property.minstay,
          maxadults: msg.property.property.maxadults,
          maxchild: msg.property.property.maxchild,
          //   availability: msg.property.property.availability,
          description: msg.property.property.description,
          unit: msg.property.property.unit,
          city: msg.property.property.city,
          state: msg.property.property.state,
          zip: msg.property.property.zip,
          country: msg.property.property.country,
          address: msg.property.property.address
        };
        console.log("myobj", myObj);
        HomeAway.findOneAndUpdate(
          { "user.username": msg.property.property.username },
          { $push: { properties: myObj } },
          function(err, doc) {
            if (err) {
              res.code = "400";
              res.value = "Cannot post property at the moment";
              console.log(res.value);
              callback(err, res);
            } else {
              res.code = "200";
              res.value = doc;
              console.log(doc);
              callback(null, res);
            }
          }
        );
      }
    })
    .catch(function(err) {
      // just need one of these
      console.log("error:", err.message);
      res.code = "400";
      callback(err, res);
    });
  // HomeAway.findOne({}, { "Property.prop_id": 1, _id: 0 }, function(err, user) {
  //   if (err) {
  //     res.code = "400";
  //     res.value = "Could not Book Property";
  //     console.log(res.value);
  //     // res.code = "200";
  //     // res.value = user;
  //     // console.log(user);
  //     // console.log(res.value);
  //   } else {

  //   }
  // });
  //var promise = myObj.save();
}
exports.handle_request = handle_request;
