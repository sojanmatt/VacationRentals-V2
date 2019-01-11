var bcrypt = require("bcrypt");

var HomeAway = require("../model/homeaway");
const saltRounds = 10;
function handle_request(msg, callback) {
  var res = {};
  console.log("In owner signup handle request:" + JSON.stringify(msg));

  // var key = "273";

  // var hash = crypto.createHmac("sha512", key); //encrytion using SHA512
  console.log("signup message", msg);
  //hash.update(msg.password);
  // msg.password = hash.digest("hex");
  bcrypt.hash(msg.password, saltRounds, function(err, hash) {
    hashed_password = hash;
    // var username = req.body.Email;
    // var firstname = req.body.Fname;
    // var lastname = req.body.Lname;

    // var travelerdetails = {
    //   username: username,
    //   password: hashed_password,
    //   Fname: firstname,
    //   Lname: lastname,
    //   isTraveler: "1"
    // };

    var myobj = new HomeAway({
      user: {
        username: msg.username,
        password: hashed_password,
        Fname: msg.Fname,
        Lname: msg.Lname,
        isOwner: "1"
      }
    });

    // res.value = msg;
    // res.code = 200;

    var promise = myobj.save();

    promise
      .then(function() {
        res.value = msg;
        res.code = 200;
        callback(null, res);
      })

      .catch(function(err) {
        console.log("error:", err.message);
        if (err.message.includes("username_1 dup key:"))
          res.value = "This username already exists!";
        else res.value = "Error in registering data please try again!";

        res.code = "400";
        callback(null, res);
      });
  });
}

exports.handle_request = handle_request;
