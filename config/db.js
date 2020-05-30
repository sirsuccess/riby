const sqlite3 = require("sqlite3").verbose();

const {
  toCreateEVent,
  toCreateRepo,
  toCreateActor,
} = require("../queries/index");

const DBSOURCE = "trackingDB.sqlite";

//create DB and tables
let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    //create event table

    db.run(toCreateEVent, (err) => {
      if (err) {
        // Table already created
        console.log("Table user already created");
      }
    });
    //create repo table

    db.run(toCreateRepo, (err) => {
      if (err) {
        // Table already created
        console.log("Table repo already created");
      }
    });
    //create actor table

    db.run(toCreateActor, (err) => {
      if (err) {
        // Table already created
        console.log("Table Actor already created");
      }
    });
  }
});

module.exports = db;
