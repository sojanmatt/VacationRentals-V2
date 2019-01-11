var kafka = require("../kafka/client");

exports.login = function(req, res) {
  console.log("Inside Login Post Request");
  console.log("reqis", req.body.username);
  kafka.make_request(
    "traveler_login_topic",
    { username: req.body.username, password: req.body.password },
    function(err, result) {
      console.log("in result");
      //  console.log(results);
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Invalid Credentials");
      } else {
        res.cookie("cookie", req.body.username, {
          maxAge: 900000,
          httpOnly: false,
          path: "/"
        });
        console.log("Successfully retrieving");
        res.status(200).send(JSON.stringify(req.body.username));
      }
    }
  );
};
