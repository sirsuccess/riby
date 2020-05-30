const router = require("express").Router();

const {
  getAllActors,
  updateActor,
  getStreak,
  updateActorCtr,
} = require("../controllers/actors");

// Routes related to actor.
router
  .get("/", getAllActors)
  .get("/streak", getStreak)
  .put("/", updateActorCtr);

module.exports = router;
