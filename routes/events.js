const router = require("express").Router();

const {
  getAllEventsCtrl,
  addEvent,
  getByActor,
} = require("../controllers/events");

// Routes related to event
router
  .get("/", getAllEventsCtrl)
  .get("/actors/:id", getByActor)
  .post("/", addEvent);

module.exports = router;
