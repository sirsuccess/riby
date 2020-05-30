const express = require("express");
const router = express.Router();
const db = require("../config/db");
// const {
//   getAllEvents,
//   addEvent,
//   getByActor,
//   eraseEvents,
// } = require("../controllers/events");
const {
  getAllEvents,
  getAllActorEvents,
  getEventActors,
  deleteSingleEvent,
  postActor,
  postRepo,
  postEvent,
  eventSelectAllActor,
  eventSelectAllRepo,
} = require("../queries/index");

// Routes related to event
router.route("/").get((req, res) => {
  try {
    db.all(getAllEvents, (err, rows) => {
      if (err) {
        throw new Error(err.message);
        //res.status(400).json({ error: err.message });
        return;
      }
      let eventData = [];
      rows.map((event) => {
        //destructure event
        const {
          eventID,
          type,
          actor_id,
          login,
          avatar_url,
          repo_id,
          name,
          url,
          created_at,
        } = event;

        //push to eventData arr
        eventData.push({
          id: eventID,
          type,
          actor: {
            id: actor_id,
            login,
            avatar_url,
          },
          repo: {
            id: repo_id,
            name,
            url,
          },
          created_at,
        });
      });
      return res.status(200).json(eventData);
    });
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});

router.route("/actors/:id").get((req, res) => {
  try {
    const params = req.params.id;
    db.all(getAllActorEvents, params, (err, rows) => {
      if (err) {
        throw new Error(err.message);
        //res.status(400).json({ error: err.message });
        return;
      }
      //if not found
      if (rows.length < 1) {
        res.status(404).json({
          message: "item not found",
        });
      }

      let eventData = [];
      rows.map((event) => {
        //destructure event
        const {
          eventID,
          type,
          actor_id,
          login,
          avatar_url,
          repo_id,
          name,
          url,
          created_at,
        } = event;

        //push to eventData arr
        eventData.push({
          id: eventID,
          type,
          actor: {
            id: actor_id,
            login,
            avatar_url,
          },
          repo: {
            id: repo_id,
            name,
            url,
          },
          created_at,
        });
      });
      return res.status(200).json(eventData);
    });
  } catch (error) {
    res.status(404).json({ error: err.message });
  }
});

router.route("/actors").get((req, res) => {
  try {
    const params = req.body.id;
    db.all(getEventActors, params, (err, rows) => {
      if (err) {
        throw new Error(err.message);
        //res.status(400).json({ error: err.message });
        return;
      }
      //if not found
      if (rows.length < 1) {
        throw new Error({
          message: "item not found",
        });
      }

      let eventData = [];
      rows.map((event) => {
        //destructure event
        const {
          id,
          type,
          actor_id,
          login,
          avatar_url,
          repo_id,
          name,
          url,
          created_at,
        } = event;

        //push to eventData arr
        eventData.push({
          id,
          type,
          actor: {
            id: actor_id,
            login,
            avatar_url,
          },
          repo: {
            id: repo_id,
            name,
            url,
          },
          created_at,
        });
      });
      return res.status(200).json(eventData);
    });
  } catch (error) {
    res.status(404).json({ error: err.message });
  }
});

router.route("/:id").delete((req, res) => {
  db.run(deleteSingleEvent, req.params.id, function (err, result) {
    if (err) {
      throw new Error(err.message);
    }
    res.status(200).json({ message: "deleted", changes: this.changes });
  });
});

router.post("/", (req, res, next) => {
  try {
    const { id, type, actor, repo, created_at } = req.body;

    var eventParams = [id, type, repo.id, actor.id, created_at];
    var actorParams = [actor.id, actor.login, actor.avatar_url];
    var repoParams = [repo.id, repo.name, repo.url];

    db.all(eventSelectAllActor, actor.id, (err, rows) => {
      //if not found
      if (rows.length < 1) {
        db.run(postActor, actorParams, function (err, result) {
          if (err) {
            throw new Error(err.message);
          }
        });
      }
    });

    db.all(eventSelectAllRepo, repo.id, (err, rows) => {
      //if not found
      if (rows.length < 1) {
        db.run(postRepo, repoParams, function (err, result) {
          if (err) {
            throw new Error(err.message);
          }
        });
      }
    });

    db.run(postEvent, eventParams, function (err, result) {
      if (err) {
        throw new Error(err.message);
      }
      res.status(201).json({
        message: "success",
      });
    });
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
