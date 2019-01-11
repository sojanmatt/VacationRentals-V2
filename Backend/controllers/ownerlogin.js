var kafka = require("../kafka/client");

// export const ownerlogin = {
//   ownerlogin
// };
exports.ownerlogin = function(req, res) {
  console.log("Inside Owner Login Post Request");

  kafka.make_request(
    "owner_login_topic",
    { username: req.body.username, password: req.body.password },
    function(err, result) {
      console.log("Connected!");
      console.log("req.body.username", req.body.username);
      console.log("req.body.password", req.body.password);

      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Invalid Credentials");
      } else {
        res.cookie("cookieOwner", req.body.username, {
          maxAge: 900000,
          httpOnly: false,
          path: "/"
        });
        req.session.user = result;
        console.log("Successfully retrieving owner login");
        console.log("req.body.username", JSON.stringify(req.body.username));

        res.status(200).send(JSON.stringify(req.body.username));
        // res.end("Successful Login");
        // console.log("result0", result);
      } //else
    }
  );
};
