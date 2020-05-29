const express = require("express");
const router = express.Router();
const db = require("../config/db");
const {
  getAllEvents,
  addEvent,
  getByActor,
  eraseEvents,
} = require("../controllers/events");

// Route related to delete events
router.route("/").delete((req, res) => {
  try {
    const sqlEvent = "DELETE from events";
    const sqlRepo = "DELETE from repo";
    const sqlActor = "DELETE from actor";

    db.run(sqlActor, function (err, result) {
      if (err) {
        throw new Error(err.message);
      }
    });
    db.run(sqlEvent, function (err, result) {
      if (err) {
        throw new Error(err.message);
      }
    });
    db.run(sqlRepo, function (err, result) {
      if (err) {
        throw new Error(err.message);
      }
    });
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({
      message: "success",
    });
  }
});

module.exports = router;
