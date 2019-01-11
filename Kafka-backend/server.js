var connection = require("./Kafka/Connection");
var mongoose = require("mongoose");
var login = require("./Services/login");
var ownerlogin = require("./Services/ownerlogin");
var travelersignup = require("./Services/signup");
var ownersignup = require("./Services/ownersignup");
var ownerdashboard = require("./Services/dashboard");
var tripboards = require("./Services/tripboards");
var updateprofile = require("./Services/updateprofile");
var getprofile = require("./Services/getuserdetails");
var bookproperty = require("./Services/bookproperty");
var postProperty = require("./Services/listproperty");
var getplaces = require("./Services/places");
var askaquestion = require("./Services/askquestion");
var getallquestions = require("./Services/getallquestions");
var gettravelerquestions = require("./Services/getquestiondetail");

var producer = connection.getProducer();

var consumer_traveler_login = connection.getConsumer("traveler_login_topic");
var consumer_owner_login = connection.getConsumer("owner_login_topic");
var consumer_traveler_signup = connection.getConsumer("traveler_signup_topic");
var consumer_owner_signup = connection.getConsumer("owner_signup_topic");
var consumer_owner_listings = connection.getConsumer(
  "get_owner_listings_topic"
);
consumer_edit_profile = connection.getConsumer("editprofile_topic");
consumer_get_profile = connection.getConsumer("getprofile_topic");
consumer_book_property = connection.getConsumer("bookproperty_topic");
consumer_post_property = connection.getConsumer("list_property_topic");
consumer_get_places = connection.getConsumer("get_places_topic");

consumer_askquestion = connection.getConsumer("ask_question_topic");
consumer_getquestions = connection.getConsumer("get_questions_topic");

consumer_get_traveler_questions = connection.getConsumer(
  "get_traveler_questions_topic"
);
var consumer_traveler_tripboards = connection.getConsumer(
  "get_traveler_tripboards_topic"
);

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function() {
  console.log("Connection Successful!");
});

consumer_traveler_login.on("message", function(message) {
  console.log("message received");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  login.handle_request(data.data, function(err, res) {
    console.log("after handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("Logged In");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_traveler_signup.on("message", function(message) {
  console.log("signup message received");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  travelersignup.handle_request(data.data, function(err, res) {
    console.log("after signup  handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("Signed up");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_owner_login.on("message", function(message) {
  console.log("message received");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  ownerlogin.handle_request(data.data, function(err, res) {
    console.log("after owner login handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("Logged In");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_owner_signup.on("message", function(message) {
  console.log("signup message received");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  ownersignup.handle_request(data.data, function(err, res) {
    console.log("after owner signup  handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("Owner Signed up");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_owner_listings.on("message", function(message) {
  console.log("get owner listings consumer");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  ownerdashboard.handle_request(data.data, function(err, res) {
    console.log("after owner listings  handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("Owner Signed up");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_edit_profile.on("message", function(message) {
  console.log("edit profile listings consumer");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  updateprofile.handle_request(data.data, function(err, res) {
    console.log("after edit profile listings  handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("profile edited ");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_get_profile.on("message", function(message) {
  console.log("get profile  consumer");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  getprofile.handle_request(data.data, function(err, res) {
    console.log("after get profile listings  handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("profile fetched ");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_book_property.on("message", function(message) {
  console.log("book property  consumer");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  bookproperty.handle_request(data.data, function(err, res) {
    console.log("after book property   handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("property booked ");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_post_property.on("message", function(message) {
  console.log("post property  consumer");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  postProperty.handle_request(data.data, function(err, res) {
    console.log("after post property   handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("property listed ");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_get_places.on("message", function(message) {
  console.log("get places  consumer");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  getplaces.handle_request(data.data, function(err, res) {
    console.log("after post property   handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("property listed ");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_askquestion.on("message", function(message) {
  console.log("ask question  consumer");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  askaquestion.handle_request(data.data, function(err, res) {
    console.log("after ask question   handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("question posted ");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_getquestions.on("message", function(message) {
  console.log("ask question  consumer");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  getallquestions.handle_request(data.data, function(err, res) {
    console.log("after ask question   handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("question posted ");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_get_traveler_questions.on("message", function(message) {
  console.log("get traveler question  consumer");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  gettravelerquestions.handle_request(data.data, function(err, res) {
    console.log("after traveler question get   handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("question posted ");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});

consumer_traveler_tripboards.on("message", function(message) {
  console.log("get tripboards consumer");
  console.log(JSON.stringify(message.value));
  var data = JSON.parse(message.value);
  tripboards.handle_request(data.data, function(err, res) {
    console.log("after tripboards handle" + res);
    var payloads = [
      {
        topic: data.replyTo,
        messages: JSON.stringify({
          correlationId: data.correlationId,
          data: res
        }),
        partition: 0
      }
    ];
    producer.send(payloads, function(err, data) {
      console.log("tripboards data");
      console.log(payloads);
      console.log(data);
    });
    return;
  });
});
