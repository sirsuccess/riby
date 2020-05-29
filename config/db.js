const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "trackingDB.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
  if (err) {
    // Cannot open database
    console.error(err.message);
    throw err;
  } else {
    console.log("Connected to the SQLite database.");
    const toCreate1 = `CREATE TABLE events (
      id integer UNIQUE,
      type text,  
      repo_id integer,
      actor_id integer,
      created_at text,
      FOREIGN KEY (repo_id) REFERENCES repo (id) ON DELETE CASCADE ON UPDATE NO ACTION,
      FOREIGN KEY (actor_id) REFERENCES actor (id) ON DELETE CASCADE ON UPDATE NO ACTION
      )`;
    const toCreate2 = `CREATE TABLE repo (
        id integer UNIQUE,
        name text, 
        url text
        )`;
    const toCreate3 = `CREATE TABLE actor (
        id integer UNIQUE,
        login text, 
        avatar_url text
        )`;
    db.run(toCreate2, (err) => {
      if (err) {
        // Table already created
        console.log("Table repo already created");
      }
    });
    db.run(toCreate3, (err) => {
      if (err) {
        // Table already created
        console.log("Table Actor already created");
      }
    });

    db.run(toCreate1, (err) => {
      if (err) {
        // Table already created
        console.log("Table user already created");
      }
    });
  }
});

module.exports = db;
