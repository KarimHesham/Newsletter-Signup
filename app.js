const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https")
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {

      members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
              FNAME: firstName,
              LNAME: lastName
              }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us5.api.mailchimp.com/3.0/lists/b791c94d84";
  const options = {
    method: "POST",
    auth: "karim1:eeb5a9242d0c1f02c0546cf5cd258de9-us2"
  };

  const request = https.request(url, options, function(response) {

    const responseStatusCode = response.statusCode;

    if (responseStatusCode === 200) {
        res.sendFile(__dirname + "/success.html");
    } else {
        res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {

     console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure.html", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server up and running on port 3000.");
});
