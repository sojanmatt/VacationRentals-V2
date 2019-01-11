var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/HomeAway";
//const bcrypt = require('b');

var HomeAway = require("../model/homeaway");
function handle_request(msg, callback) {
  var res = {};
  var properties = [];
  var pipeline = [
    {
      $unwind: "$properties"
    },
    {
      $match: {
        $and: [
          { "properties.city": msg.searchplaces.location },
          // {"Property.maxadults" : { $gte : msg.maxadults}},
          // {"Property.maxchild"  : { $gte : msg.maxchild}},
          { "properties.startdate": { $lte: msg.searchplaces.fromDate } },
          { "properties.enddate": { $gte: msg.searchplaces.toDate } }
        ]
      }
    },
    {
      $project: {
        properties: "$properties",
        _id: 0
      }
    }
  ];
  console.log("In fetch places handle request:", JSON.stringify(msg));
  /* var pipeline = [
    {
      $unwind: "$properties"
    },
    {
      $match: {
        "properties.city": msg.searchplaces.location
      }
    },
    {
      $project: {
        properties: "$properties",
        _id: 0
      }
    }
  ];*/

  var promise = HomeAway.aggregate(pipeline).exec();
  promise
    .then(function(data) {
      console.log("places dashboard data-");
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
  /*
  HomeAway.find(
    // {
    //   "properties.city": msg.searchproperty.city,
    //   "properties.fromDate": {
    //     $lte: msg.searchproperty.startDate
    //   },
    //   "properties.toDate": {
    //     $gte: msg.searchproperty.endDate
    //   }
    // }
    // ,
    { "properties.city": msg.searchplaces.city },
    {
      _id: 0,
      properties: {
        $elemMatch: { city: msg.searchplaces.city }
      },
      properties: {
        $elemMatch: {
          startdate: { $lte: msg.searchplaces.startDate }
        }
      },
      properties: {
        $elemMatch: {
          enddate: { $gte: msg.searchplaces.endDate }
        }
      }
    },
    async (err, result) => {
      if (err) {
        res.code = "400";
        res.value = "Cannot search property at the moment";
        console.log(res.value);
        callback(err, res);
      } else {
        console.log(
          "property list seacrh based on availability dates",
          JSON.stringify(result)
        );

        properties = result;
        var propertyResult = [];
        // for (let i = 0; i < properties.length; i++) {
        //   console.log("Insideproperties array: ", properties[i].prop_id);

        //   await HomeAway.find(
        //     {
        //       "bookings.prop_id": properties[i].prop_id
        //     },
        //     (err, result) => {
        //       if (err) {
        //         res.code = "400";
        //         res.value = "Cannot search property at the moment";
        //         console.log(res.value);
        //         callback(err, res);
        //       } else {
        //         if (result.length > 0) {
        //           var bookingstartdate = result[0].Bookingstartdate;
        //           var bookingenddate = result[0].Bookingenddate;

        //           if (
        //             (msg.searchproperty.startDate >= bookingstartdate &&
        //               msg.searchproperty.startDate) <= bookingenddate ||
        //             (msg.searchproperty.endDate >= bookingstartdate &&
        //               msg.searchproperty.endDate <= bookingenddate)
        //           ) {
        //             properties.splice(i, 1);
        //           }
        //         }
        //       }
        //     }
        //   );
        // }

        // res.writeHead(200, {
        //   "Content-type": "application/json"
        // });
        // console.log(JSON.stringify(properties));
        // res.end(JSON.stringify(properties));
        res.code = 200;
        res.value = result;
        callback(null, res);
      }

      //console.log('property list seacrh based on availability dates', properties);
    }
  );*/
}

exports.handle_request = handle_request;
