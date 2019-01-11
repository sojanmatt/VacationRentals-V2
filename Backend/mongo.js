//import the require dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var cors = require("cors");
app.set("view engine", "ejs");
let fs = require("fs");
var path = require("path");
var async = require("async");

var mysql = require("mysql");
const multer = require("multer");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var pool = require("./pool");
//use cors to allow cross origin resource sharing

//use express session to maintain session data
app.use(
  session({
    secret: "cmpe273_kafka_passport_mongo",
    resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration: 5 * 60 * 1000
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
//app.use(bodyParser.json());

/*
var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "qwerty@123",
  database: "testing",
  multipleStatements: true
});*/
var con = mysql.createPool({
  connectionLimit: 100,
  host: "127.0.0.1",
  user: "root",
  password: "qwerty@123",
  database: "testing"
});
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017";
const dbname = "HomeAway";

//Allow Access Control
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Cache-Control", "no-cache");
  next();
});
var prop_id = null;
//Route to handle Post Request Call
// app.post("/login", function(req, res) {
//   console.log("Inside Login Post Request");

//   con.getConnection(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     console.log("req.body.username", req.body.username);
//     console.log("req.body.password", req.body.password);

//     var username = req.body.username;
//     var password = req.body.password;
//     var sql =
//       "SELECT password  FROM homeaway.user_details WHERE username = " +
//       mysql.escape(username) +
//       " and isTraveller=1";
//     // +
//     // "and password = " +
//     // mysql.escape(password)
//     console.log("sql for login", sql);
//     con.query(sql, function(err, result) {
//       if (err) {
//         res.writeHead(400, {
//           "Content-Type": "text/plain"
//         });
//         res.end("Invalid Credentials");
//       } else {
//         console.log("result0", result[0]);
//         if (result[0]) {
//           console.log("result is " + result[0].password);
//           console.log("Body is  " + req.body.password);
//           bcrypt.compare(req.body.password, result[0].password, function(
//             err,
//             answer
//           ) {
//             console.log("answer is " + JSON.stringify(answer));
//             if (answer) {
//               res.cookie("cookie", req.body.username, {
//                 maxAge: 900000,
//                 httpOnly: false,
//                 path: "/"
//               });
//               req.session.user = result;
//               console.log("Successfully retrieving");
//               console.log(
//                 "req.body.username",
//                 JSON.stringify(req.body.username)
//               );

//               res.status(200).send(JSON.stringify(req.body.username));
//               res.end("Successful Login");
//               console.log(JSON.stringify(res.cookie));
//             } else {
//               res.writeHead(400, {
//                 "Content-Type": "text/plain"
//               });
//               res.end("Invalid Credentials");
//             }
//           });
//         } else {
//           console.log("400");
//           res.status(400).send({ message: "Invalid Credentials !" });
//           // res.writeHead(400, {
//           //   "Content-Type": "text/plain"
//           // });
//           // res.end("Invalid Credentials");
//         }

//         // res.cookie("cookie", "admin", {
//         //   maxAge: 900000,
//         //   httpOnly: false,
//         //   path: "/"
//         // });
//         // console.log("cookie", res.cookie);
//         // req.session.user = result[0];
//         // console.log("result", result);
//         // console.log("req.session.user", req.session.user);
//         // res.writeHead(200, {
//         //   "Content-Type": "text/plain"
//         // });
//         // res.end(JSON.stringify(result));
//         // console.log("result login", result);
//       }
//     });
//   });
// });

app.post("/login", function(req, res) {
  console.log("Inside Login Post Request");
  console.log("request", req.body);

  MongoClient.connect(
    url,
    function(err, client) {
      if (err) throw err;
      else {
        const db = client.db(dbname);
        console.log("Connected!");
        console.log("req.body.username", req.body);
        console.log("req.body.password", req.body.password);

        var username = req.body.username;
        var password = req.body.password;

        db.collection("HomeAway").findOne(
          { User: { $: { username: req.body.username } } },
          function(err, result) {
            if (err) {
              res.writeHead(400, {
                "Content-Type": "text/plain"
              });
              res.end("Invalid Credentials");
              client.close();
            } else {
              console.log("result0", User);
              if (result[0]) {
                console.log("result is " + result[0].password);
                console.log("Body is  " + req.body.password);
                bcrypt.compare(req.body.password, result[0].password, function(
                  err,
                  answer
                ) {
                  console.log("answer is " + JSON.stringify(answer));
                  if (answer) {
                    res.cookie("cookie", req.body.username, {
                      maxAge: 900000,
                      httpOnly: false,
                      path: "/"
                    });
                    req.session.user = result;
                    console.log("Successfully retrieving");
                    console.log(
                      "req.body.username",
                      JSON.stringify(req.body.username)
                    );

                    res.status(200).send(JSON.stringify(req.body.username));
                    res.end("Successful Login");
                    console.log(JSON.stringify(res.cookie));
                  } else {
                    res.writeHead(400, {
                      "Content-Type": "text/plain"
                    });
                    res.end("Invalid Credentials");
                  }
                });
              } else {
                console.log("400");
                res.status(400).send({ message: "Invalid Credentials !" });
              }
            }
          }
        ); //findone
      }
    }
  );
});
/*
app.post("/ownerlogin", function(req, res) {
  console.log("Inside Owner Login Post Request");

  con.getConnection(function(err) {
    if (err) throw err;
    console.log("Connected!");
    console.log("req.body.username", req.body.username);
    console.log("req.body.password", req.body.password);

    var username = req.body.username;
    var password = req.body.password;
    var sql =
      "SELECT password  FROM homeaway.user_details WHERE username = " +
      mysql.escape(username) +
      " and isOwner=1";
    // +
    // "and password = " +
    // mysql.escape(password)
    console.log("sql for login", sql);
    con.query(sql, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Invalid Credentials");
      } else {
        console.log("result0", result[0]);
        if (result[0]) {
          console.log("result is " + result[0].password);
          console.log("Body is  " + req.body.password);
          bcrypt.compare(req.body.password, result[0].password, function(
            err,
            answer
          ) {
            console.log("answer is " + JSON.stringify(answer));
            if (answer) {
              res.cookie("cookieOwner", req.body.username, {
                maxAge: 900000,
                httpOnly: false,
                path: "/"
              });
              req.session.user = result;
              console.log("Successfully retrieving");
              console.log(
                "req.body.username",
                JSON.stringify(req.body.username)
              );

              res.status(200).send(JSON.stringify(req.body.username));
              res.end("Successful Login");
              console.log(JSON.stringify(res.cookie));
            } else {
              res.writeHead(400, {
                "Content-Type": "text/plain"
              });
              res.end("Invalid Credentials");
            }
          });
        } else {
          console.log("400");
          res.status(400).send({ message: "Invalid Credentials !" });
        }
      }
    });
  });
});
*/
app.post("/traveller/signup", function(req, res) {
  console.log("Inside Traveller signup Request Handler");
  console.log(req.body);
  MongoClient.connect(
    url,
    function(err, client) {
      if (err) {
        throw err;
      } else {
        const db = client.db(dbname);
        console.log("traveller signup connection");
        var hashed_password = "";
        bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
          hashed_password = hash;
          var username = req.body.Email;
          var firstname = req.body.Fname;
          var lastname = req.body.Lname;

          var travelerdetails = {
            username: username,
            password: hashed_password,
            Fname: firstname,
            Lname: lastname,
            isTraveler: "1"
          };

          db.collection("HomeAway").insertOne(travelerdetails, function(
            err,
            result
          ) {
            //err.sqlMessage.includes("for key 'PRIMARY''"
            if (err) {
              res.writeHead(400, {
                "Content-Type": "text/plain"
              });
              res.end("User name already exists");
              client.close();
            } else {
              console.log("traveler inserted");
              res.cookie("cookie", username, {
                maxAge: 9000000,
                httpOnly: false,
                path: "/"
              });
              req.session.user = result;
              console.log("cookie is" + cookie);
              console.log("res", req.session.ç);
              req.session.user = result;
              res.status(200).send({ message: "User Added successfully!" });
            }
          });
        });
      }
    }
  );
});
/*
//Route to get All Books when user visits the Home Page
app.get("/home", function(req, res) {
  var sql = "SELECT * FROM homeaway.user_details";
  con.query(sql, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error while retrieving Book Details");
    } else {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(result));
      console.log("JSON.stringify(result)", JSON.stringify(result));
    }
  });
});

app.post("/myProfile/:id", function(req, res) {
  console.log("req.session.user", JSON.stringify(req.params.id));
  var sql =
    "select * FROM homeaway.user_details where username= " +
    mysql.escape(req.params.id);
  con.query(sql, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error while retrieving Book Details");
    } else {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(result));
      console.log(JSON.stringify(result));
      console.log("JSON.stringify(result)", JSON.stringify(result));
    }
  });
});

app.get("/myProfile/:id", function(req, res) {
  console.log("req.session.user", JSON.stringify(req.params.id));
  var sql =
    "select * FROM homeaway.user_details where username= " +
    mysql.escape(req.params.id);
  con.query(sql, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error while retrieving Book Details");
    } else {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(result));
      console.log(JSON.stringify(result));
      console.log("JSON.stringify(result)", JSON.stringify(result));
    }
  });
});

app.delete("/delete/:id", function(req, res) {
  console.log("Inside Delete Request");
  console.log("Book to Delete : ", req.params.id);
  var sql =
    "DELETE FROM bookDetails WHERE bookID = " + mysql.escape(req.params.id);
  con.query(sql, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error Deleting Book");
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end("Book Deleted Successfully");
    }
  });
});

app.post("/create", function(req, res) {
  console.log("Inside Create Request Handler");
  var sql =
    "insert into  bookapp.bookDetails (book_name,author) values ( " +
    // mysql.escape(req.body.book_id) +
    // " , " +
    mysql.escape(req.body.book_name) +
    " , " +
    mysql.escape(req.body.author) +
    " ) ";
  console.log("sql", sql);
  con.query(sql, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error While Creating Book");
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain"
      });
      res.end("Book Created Successfully");
    }
  });
});

var storagePropFiles = multer.diskStorage({
  destination: function(req, file, callback) {
    console.log("req.session.user is", JSON.stringify(req.params));
    callback(null, createDirectory(prop_id));
  },
  filename: function(req, file, callback) {
    console.log("req", req.body);
    callback(null, file.originalname);
  }
});

var rootDirectory = "public/images/";

var uploadPropFiles = multer({
  storage: storagePropFiles
});

function createDirectory(prop_id) {
  if (!fs.existsSync(rootDirectory)) {
    fs.mkdirSync(rootDirectory);
  }
  let directory = rootDirectory + prop_id;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
  return directory;
}

app.post("/upload-files/", uploadPropFiles.any(), function(req, res, next) {
  console.log("###/saveProfile");
  console.log(JSON.stringify(req.body));
  console.log(req.body);
  if (req.session.user.username) {
    console.log(req.body, "Body");
    // console.log(req.files, 'files');
    res.status(200).send({ result: "File is uploaded" });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});

app.get("/getPropid", function(req, res) {
  console.log(req.body);

  // check user already exists
  if (true) {
    let selectQuery = "SELECT max(prop_id) as prop_id from homeaway.property;";
    con.query(selectQuery, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in Posting property.");
      } else {
        console.log("result for prop_id", result[0].prop_id);
        prop_id = result[0].prop_id + 1;
      }
      const data = { prop_id: prop_id };
      res.end(JSON.stringify(data));
    });
  }
});

app.post("/list-property", function(req, res) {
  console.log(req.body);

  // check user already exists
  if (true) {
    var currentprop_id = null;

    let selectQuery = "SELECT max(prop_id) as prop_id from homeaway.property;";
    con.query(selectQuery, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in Posting property.");
      } else {
        console.log("result for prop_id", result[0].prop_id);
        currentprop_id = result[0].prop_id + 1;
        var startDate = "2018-09-23";
        var endDate = "2014-06-22";
        let insertQuery =
          "INSERT INTO homeaway.property (`prop_id`, `bed`, `bath`, `country`, `address`, `unit`, `city`, `state`,`zip`,`headline`,`description`,`houseType`,`capacity`,`currency`,`rate`,`minStay`,`fromDate`,`toDate`) VALUES ('" +
          currentprop_id +
          "', '" +
          req.body.bed +
          "', '" +
          req.body.bath +
          "', '" +
          req.body.propDetails.country +
          "', '" +
          req.body.propDetails.address +
          "', '" +
          req.body.propDetails.unit +
          "', '" +
          req.body.propDetails.city +
          "', '" +
          req.body.propDetails.state1 +
          "', '" +
          req.body.propDetails.zip +
          "', '" +
          req.body.propDetails.headline +
          "', '" +
          req.body.propDetails.desc +
          "', '" +
          req.body.propDetails.type +
          "', '" +
          req.body.propDetails.capacity +
          "', '" +
          req.body.propDetails.currency +
          "', '" +
          req.body.propDetails.rate +
          "', '" +
          req.body.propDetails.minstay +
          "', '" +
          req.body.fromDate +
          "', '" +
          req.body.toDate +
          "')";
        con.query(insertQuery, function(err, result) {
          if (err) {
            console.log("insert", insertQuery);
            res.writeHead(400, {
              "Content-Type": "text/plain"
            });
            res.end("Error in Posting property.");
          } else {
            console.log("property inserted in property table");
            let insertPropListQuery =
              "INSERT INTO homeaway.ownerListings(`user_id`,`prop_id`,`fromDate`,`toDate`) VALUES ('" +
              req.body.userid +
              "', '" +
              currentprop_id +
              "', '" +
              req.body.fromDate +
              "', '" +
              req.body.toDate +
              "')";

            con.query(insertPropListQuery, function(err, result) {
              if (err) {
                console.log(insertPropListQuery);
                res.writeHead(400, {
                  "Content-Type": "text/plain"
                });
                res.end("Error in Posting property.");
              } else {
                res
                  .status(200)
                  .send({ message: "property Listed successfully!" });
              }
            });
            //  res.status(200).send({ message: "property Listed successfully!" });
          }
        });
      }
    });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});

app.post("/getPropertyImg", function(req, res, next) {
  console.log("image body", req.body);
  console.log("req.session.username for image", req.session.username);
  var filter = ".png";
  var results = [];
  var startPath =
    "/Users/mathewsojan/SoftwareEngineering/CMPE273/Homeaway/Backend/public/images/" +
    req.body.id;
  if (req.body.id) {
    var files = fs.readdirSync(startPath);
    console.log("files", files);

    console.log(files.length);

    fs.readFile(
      "/Users/mathewsojan/SoftwareEngineering/CMPE273/Homeaway/Backend/public/images/" +
        req.body.id +
        "/" +
        files[0],
      function(err, content) {
        console.log("###img:", content);
        console.log("###filename:", files[0]);
        if (err) {
          res.writeHead(400, { "Content-type": "text/html" });
          console.log(err);
          res.end("No such image");
        } else {
          //specify the content type in the response will be an image
          let base64Image = new Buffer(content, "binary").toString("base64");
          //  results.push(base64Image);
          console.log("###image in node");
          // console.log(base64Image);
          //console.log("results", base64Image);
          //res.status(200).send({ img: results });
          //convert image file to base64-encoded string
          res.status(200).send({ propid: req.body.id, img: base64Image });
          // res.end({img : base64Image});
        }
      }
    );

    //  console.log("result length", results);
    //  res.status(200).send({ img: results });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});

app.post("/getSelectedPropertyImg", function(req, res, next) {
  console.log("image body for selected img", req.body);
  console.log("req.session.username for image", req.session.username);
  var filter = ".png";

  var startPath =
    "/Users/mathewsojan/SoftwareEngineering/CMPE273/Homeaway/Backend/public/images/" +
    req.body.id;
  if (req.body.id) {
    var results = [];
    var files = fs.readdirSync(startPath);
    console.log("files", files);

    console.log(files.length);
    downloadFiles = () => {
      files.forEach(async function(file) {
        console.log("files in download", file);
        fs.readFile(
          "/Users/mathewsojan/SoftwareEngineering/CMPE273/Homeaway/Backend/public/images/" +
            req.body.id +
            "/" +
            file,
          await function(err, content) {
            console.log("###img:", content);
            console.log("###filename:", file);
            if (err) {
              res.writeHead(400, { "Content-type": "text/html" });
              console.log(err);
              res.end("No such image");
            } else {
              //specify the content type in the response will be an image
              let base64Image = new Buffer(content, "binary").toString(
                "base64"
              );
              results.push(base64Image);
              console.log("###image in node", results.length);
              // console.log(base64Image);
              //console.log("results", base64Image);
              console.log("results in download", results.length);
              if (results.length === files.length) {
                console.log("final result", results.length);
                res.status(200).send({ results });
              }
              //res.status(200).send({ img: results });
              //convert image file to base64-encoded string
              //res.status(200).send({ propid: req.body.id, img: base64Image });
              // res.end({img : base64Image});
            }
          }
        );
      });

      return results;
    };

    let photos = [];
    photos = downloadFiles(function(result) {
      console.log("final result", result);
    });
    console.log("phpto", photos);

    // res.status(200).send({ img: results });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});

app.post("/editprofile/save", function(req, res) {
  var startDate = "2018-09-23";
  var endDate = "2014-06-22";
  console.log("edit priofile", JSON.stringify(req.body));

  let updateQuery =
    "UPDATE homeaway.user_details SET aboutMe =" +
    '"' +
    req.body.About +
    '"' +
    "," +
    "company =" +
    '"' +
    req.body.Company +
    '"' +
    "," +
    "school =" +
    '"' +
    req.body.School +
    '"' +
    "," +
    "hometown =" +
    '"' +
    req.body.Hometown +
    '"' +
    "," +
    "languages =" +
    '"' +
    req.body.Languages +
    '"' +
    "," +
    "gender =" +
    '"' +
    req.body.Gender +
    '"' +
    "," +
    "city =" +
    '"' +
    req.body.City +
    '"' +
    " WHERE username=" +
    '"' +
    req.body.userId +
    '"' +
    ";";
  console.log("QUERY IS " + updateQuery);

  con.query(updateQuery, function(err, result) {
    if (err) {
      console.log("insert", updateQuery);
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error in Updating profile.");
    } else {
      res.status(200).send({ message: "profile updated successfully!" });
    }
  });
});

app.post("/book-property", function(req, res) {
  console.log(req.body);
  var startDate = "2018-09-23";
  var endDate = "2014-06-22";
  // check user already exists
  if (true) {
    let insertQuery =
      "INSERT INTO homeaway.travellerBookings (`user_id`, `prop_id`, `fromDate`, `toDate`) VALUES ('" +
      req.body.userId +
      "', '" +
      req.body.prop_id +
      "', '" +
      req.body.fromDate +
      "', '" +
      req.body.toDate +
      "')";

    con.query(insertQuery, function(err, result) {
      if (err) {
        res.writeHead(400, {
          "Content-Type": "text/plain"
        });
        res.end("Error in Booking property.");
      } else {
        res.status(200).send({ message: "property booked successfully!" });
      }
    });
  } else {
    res.statusMessage = "invalid session";
    res.status(401).end();
  }
});

app.post("/places", function(req, res) {
  console.log("places request are ", req.body);
  // let selectQuery = "SELECT * from homeaway.property;";
  let selectQuery =
    "SELECT * from homeaway.property where city like '%" +
    req.body.location +
    "%' " +
    " and adults >= " +
    req.body.adults +
    " and children >= " +
    req.body.kids +
    " and prop_id not in ( select distinct(prop_id) from HomeAway.TravellerBookings where " +
    '"' +
    req.body.fromDate +
    '"' +
    " between  fromDate and toDate || " +
    '"' +
    req.body.toDate +
    '"' +
    " between fromDate and toDate || fromDate between" +
    '"' +
    req.body.fromDate +
    '"' +
    "and" +
    '"' +
    req.body.toDate +
    '"' +
    "|| toDate between" +
    '"' +
    req.body.fromDate +
    '"' +
    "and" +
    '"' +
    req.body.toDate +
    '"' +
    ")" +
    "and " +
    '"' +
    req.body.fromDate +
    '"' +
    " between  fromDate and toDate and  " +
    '"' +
    req.body.toDate +
    '"' +
    " between fromDate and toDate" +
    " ;";

  // "SELECT *  FROM homeaway.property WHERE city  like '%" +
  //   req.body.location +
  //   "%'";

  console.log(selectQuery);
  con.query(selectQuery, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error in Posting property.");
    } else {
      res.status(200).send(JSON.stringify(result));
    }
  });
});

app.get("/places/getListings/:id", function(req, res) {
  let selectQuery =
    "SELECT * from homeaway.property where prop_id=" +
    mysql.escape(req.params.id);
  console.log("selectQuery is", selectQuery);
  con.query(selectQuery, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      res.end("Error in Posting property.");
    } else {
      res.status(200).send(JSON.stringify(result));
    }
  });
});

app.get("/places/latestbookings/:id", function(req, res) {
  let selectQuery =
    "SELECT  prop_id from homeaway.travellerBookings where user_id=" +
    mysql.escape(req.params.id) +
    " order by fromDate desc LIMIT 2";
  console.log("selectQuery for latest listings", selectQuery);
  con.query(selectQuery, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      console.log(selectQuery);
      res.end("Error in getting details.");
    } else {
      var propid = [];
      console.log("result for trip boardsr", result);
      if (result.length > 0) {
        console.log("result for trip boardsr", result);
        if (result.length < 2) {
          prop_id = [result[0].prop_id, null];
        } else {
          prop_id = [result[0].prop_id, result[1].prop_id];
        }

        console.log("propid for BOOKINGS", propid);

        let selectQuery =
          "SELECT  * from homeaway.property where prop_id in (" +
          prop_id[0] +
          "," +
          prop_id[1] +
          ")";
        con.query(selectQuery, function(err, result) {
          if (err) {
            console.log(selectQuery);
            res.writeHead(400, {
              "Content-Type": "text/plain"
            });
            res.end("No Bookings Found in Posting property.");
          } else {
            res.status(200).send(JSON.stringify(result));
          }
        });
      } else {
        res.status(400).send({ message: "No Bookings Found !" });
      }
    }
  });
});

app.get("/properties/latestlistings/:id", function(req, res) {
  let selectQuery =
    "SELECT  prop_id from homeaway.ownerListings where user_id=" +
    mysql.escape(req.params.id) +
    " order by fromDate desc LIMIT 2";
  console.log("Owner Dashboard query", selectQuery);
  con.query(selectQuery, function(err, result) {
    if (err) {
      res.writeHead(400, {
        "Content-Type": "text/plain"
      });
      console.log(selectQuery);
      res.end("Error in Posting property.");
    } else {
      if (result.length > 0) {
        var propid = [];
        console.log(result);

        if (result.length < 2) {
          prop_id = [result[0].prop_id, null];
        } else {
          prop_id = [result[0].prop_id, result[1].prop_id];
        }

        console.log("propid for listings", propid);

        let selectQuery =
          "SELECT  * from homeaway.property where prop_id in (" +
          prop_id[0] +
          "," +
          prop_id[1] +
          ")";
        con.query(selectQuery, function(err, result) {
          if (err) {
            console.log(selectQuery);
            res.writeHead(400, {
              "Content-Type": "text/plain"
            });
            res.end("Error in Posting property.");
          } else {
            res.status(200).send(JSON.stringify(result));
          }
        });
      } else {
        res.status(400).send({ message: "No Listings Found !" });
      }
    }
  });
});

// app.post("/traveller/signup", function(req, res) {
//   console.log("Inside Traveller signup Request Handler");
//   console.log(req.body);
//   con.getConnection(function(err) {
//     if (err) {
//       throw err;
//     }
//     var hashed_password = "";
//     bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
//       hashed_password = hash;
//       var username = req.body.Email;
//       var firstname = req.body.Fname;
//       var lastname = req.body.Lname;
//       var insertNewUser =
//         "insert into  homeaway.user_details (username,password,Fname,Lname,isTraveller) values ( " +
//         // mysql.escape(req.body.book_id) +
//         // " , " +
//         mysql.escape(username) +
//         " , " +
//         mysql.escape(hashed_password) +
//         " , " +
//         mysql.escape(firstname) +
//         " , " +
//         mysql.escape(lastname) +
//         " , " +
//         `1` +
//         " ) ";
//       console.log("insertNewUser", insertNewUser);
//       con.query(insertNewUser, function(err, result) {
//         //err.sqlMessage.includes("for key 'PRIMARY''"
//         if (err) {
//           res.writeHead(400, {
//             "Content-Type": "text/plain"
//           });
//           res.end("User name already exists");
//         } else {
//           var sql =
//             "SELECT *  FROM homeaway.user_details WHERE username = " +
//             mysql.escape(req.body.Email) +
//             "and password = " +
//             mysql.escape(hashed_password);

//           con.query(sql, function(err, result) {
//             if (err) {
//               console.log("Select is", sql);
//               res.writeHead(400, {
//                 "Content-Type": "text/plain"
//               });
//               res.end("Invalid Credentials");
//             } else {
//               res.cookie("cookie", "cookie", {
//                 maxAge: 900000,
//                 httpOnly: false,
//                 path: "/"
//               });
//               console.log("cookie", res.cookie);
//               req.session.user = result[0];
//               console.log("result", result);
//               console.log("req.session.user", req.session.user);
//               // res.writeHead(200, {
//               //   "Content-Type": "text/plain"
//               // });
//               res.status(200).send({ message: "User Added successfully!" });
//               // console.log("result login", result);
//             }
//           });
//         }
//       });
//     });
//   });
// });

app.post("/owner/signup", function(req, res) {
  console.log("Inside Owner signup Request Handler");
  console.log(req.body);
  con.getConnection(function(err) {
    if (err) {
      throw err;
    }

    var hashed_password = "";
    bcrypt.hash(req.body.Password, saltRounds, function(err, hash) {
      hashed_password = hash;
      var username = req.body.Email;
      var firstname = req.body.Fname;
      var lastname = req.body.Lname;
      var insertNewUser =
        "insert into  homeaway.user_details (username,password,Fname,Lname,isOwner) values ( " +
        // mysql.escape(req.body.book_id) +
        // " , " +
        mysql.escape(username) +
        " , " +
        mysql.escape(hashed_password) +
        " , " +
        mysql.escape(firstname) +
        " , " +
        mysql.escape(lastname) +
        " , " +
        `1` +
        " ) ";
      console.log("insertNewUser", insertNewUser);
      con.query(insertNewUser, function(err, result) {
        //err.sqlMessage.includes("for key 'PRIMARY''"
        if (err) {
          res.writeHead(400, {
            "Content-Type": "text/plain"
          });
          res.end("User name already exists");
        } else {
          var sql =
            "SELECT *  FROM homeaway.user_details WHERE username = " +
            mysql.escape(req.body.Email) +
            "and password = " +
            mysql.escape(hashed_password);

          con.query(sql, function(err, result) {
            if (err) {
              console.log("Select is", sql);
              res.writeHead(400, {
                "Content-Type": "text/plain"
              });
              res.end("Invalid Credentials");
            } else {
              res.cookie("cookieOwner", "owner", {
                maxAge: 900000,
                httpOnly: false,
                path: "/"
              });
              console.log("cookie", res.cookie);
              req.session.user = result[0];
              console.log("result", result);
              console.log("req.session.user", req.session.user);
              // res.writeHead(200, {
              //   "Content-Type": "text/plain"
              // });
              res.status(200).send({ message: "User Added successfully!" });
              // console.log("result login", result);
            }
          });
        }
      });
    });
  });
});

// function calculateDate(fromDate, toDate) {
//   let startdateYEARextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + fromDate + '"' + ",'%Y');";
//   let enddateYEARextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + toDate + '"' + ",'%Y');";
//   let startdateMONTHextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + fromDate + '"' + ",'%m');";
//   let enddateMONTHextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + toDate + '"' + ",'%m');";
//   let startdateDAYextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + fromDate + '"' + ",'%d');";
//   let enddateDAYextractSQL =
//     "SELECT DATE_FORMAT(" + '"' + toDate + '"' + ",'%d');";

//   con.query(startdateYEARextractSQL, function(err, result) {
//     for (var key in result) {
//       var startdateYEARextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("STARTYEAR IS " + startdateYEARextractSQL);
//     }
//   });
//   con.query(startdateMONTHextractSQL, function(err, result) {
//     for (var key in result) {
//       var startdateMONTHextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("STARTMONTH IS " + startdateMONTHextractSQL);
//     }
//   });
//   con.query(startdateDAYextractSQL, function(err, result) {
//     for (var key in result) {
//       var startdateDAYextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("STARTDAY IS " + startdateDAYextractSQL);
//     }
//   });

//   con.query(enddateYEARextractSQL, function(err, result) {
//     for (var key in result) {
//       var enddateYEARextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("ENDYEAR IS " + enddateYEARextractSQL);
//     }
//   });

//   con.query(enddateMONTHextractSQL, function(err, result) {
//     for (var key in result) {
//       var enddateMONTHextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("ENDMONTH IS " + enddateMONTHextractSQL);
//     }
//   });

//   con.query(enddateDAYextractSQL, function(err, result) {
//     for (var key in result) {
//       var enddateDAYextractSQL = JSON.stringify(result[key])
//         .split(":")
//         .pop()
//         .slice(0, -1);
//       console.log("ENDDAY IS " + enddateDAYextractSQL);
//     }
//   });

//   var resultfromDate =
//     startdateMONTHextractSQL + startdateDAYextractSQL + startdateYEARextractSQL;
//   var resulttoDate =
//     enddateMONTHextractSQL + enddateDAYextractSQL + enddateYEARextractSQL;
// }
*/
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");
