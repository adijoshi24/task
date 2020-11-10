const mongodb = require("mongodb").MongoClient;
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("patient.csv");

let url = "link";  // insert your database link here

mongodb.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) throw err;

    client
      .db("<dbname>")
      .collection("<collectionname>")
      .find({}).project({'ddlDoctor' : 0 , 'submitButon' : 0 , '_id' : 0})
      .toArray((err, data) => {
        if (err) throw err;

        console.log(data);
        fastcsv 
          .write(data, { headers: true })
          .on("finish", function() {
            console.log("Patient info stored in CSV successfully!");
          })
          .pipe(ws);

        client.close();
      });
  }
);