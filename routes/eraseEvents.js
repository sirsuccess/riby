const express = require("express");
const router = express.Router();
const db = require("../config/db");
const {
  getAllEvents,
  addEvent,
  getByActor,
  eraseEvents,
} = require("../controllers/events");
const { deleteEvents, deleteRepos, deleteActors } = require("../queries/index");

// Route related to delete events
router.route("/").delete((req, res) => {
  try {
    db.run(deleteActors, function (err, result) {
      if (err) {
        throw new Error(err.message);
      }
    });
    db.run(deleteEvents, function (err, result) {
      if (err) {
        throw new Error(err.message);
      }
    });
    db.run(deleteRepos, function (err, result) {
      if (err) {
        throw new Error(err.message);
      }
    });
    res.status(200).json({});
  } catch (error) {
    res.status(400).json({
      message: "failed",
    });
  }
});

module.exports = router;
