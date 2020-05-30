const router = require("express").Router();

const { eraseEvents } = require("../controllers/events");

// Route related to delete events
router.delete("/", eraseEvents);

module.exports = router;
