const express = require("express");
const router = express.Router();
const db = require("../config/db");
const {
  getAllEvents,
  addEvent,
  getByActor,
  eraseEvents,
} = require("../controllers/events");

// Routes related to event
router.route("/").get((req, res) => {
  try {
    const sql =
      "SELECT events.id as eventID, events.type, events.repo_id, events.actor_id, events.created_at, repo.id as repoID, repo.name, repo.url, " +
      "actor.id as actorID, actor.login, actor.avatar_url " +
      "FROM events " +
      "INNER JOIN repo on events.repo_id = repo.id " +
      "INNER JOIN actor on events.actor_id = actor.id " +
      "ORDER BY events.id ASC";
    db.all(sql, (err, rows) => {
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
    const sql =
      "SELECT events.id as eventID, events.type, events.repo_id, events.actor_id, events.created_at, repo.id as repoID, repo.name, repo.url, " +
      "actor.id as actorID, actor.login, actor.avatar_url " +
      "FROM events " +
      "INNER JOIN repo on events.repo_id = repo.id " +
      "INNER JOIN actor on events.actor_id = actor.id " +
      "WHERE actor_id=?" +
      "ORDER BY events.id ASC";
    // const sql = `SELECT * FROM events INNER JOIN repo on events.repo_id=repo.id INNER JOIN actor on events.actor_id=actor.id WHERE actor_id=? ORDER BY events.id ASC`;
    const params = req.params.id;

    db.all(sql, params, (err, rows) => {
      if (err) {
        throw new Error(err.message);
        //res.status(400).json({ error: err.message });
        return;
      }
      //if not found
      if (rows.length < 1) {
        // throw new Error({
        //   message: "item not found",
        // });
        // console.log("i am here");
        res.status(404).json({
          message: "item not found",
        });
        // return;
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
    const sql = `SELECT * FROM events INNER JOIN repo on events.repo_id=repo.id INNER JOIN actor on events.actor_id=actor.id WHERE actor_id=? ORDER BY events.id ASC`;
    const params = req.body.id;
    db.all(sql, params, (err, rows) => {
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
        // console.log("i am here");
        // res.status(404).json({
        //   message: "item not found",
        // });
        // return;
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
  db.run("DELETE FROM events WHERE id = ?", req.params.id, function (
    err,
    result
  ) {
    if (err) {
      throw new Error(err.message);
    }
    res.status(200).json({ message: "deleted", changes: this.changes });
  });
});

router.post("/", (req, res, next) => {
  try {
    const { id, type, actor, repo, created_at } = req.body;
    var eventSQL =
      "INSERT INTO events (id, type, repo_id, actor_id, created_at) VALUES (?,?,?,?,?)";
    var eventParams = [id, type, repo.id, actor.id, created_at];
    var actorSQL = "INSERT INTO actor (id, login, avatar_url) VALUES (?,?,?)";
    var actorParams = [actor.id, actor.login, actor.avatar_url];
    var repoSQL = "INSERT INTO repo (id, name, url) VALUES (?,?,?)";
    var repoParams = [repo.id, repo.name, repo.url];
    const sqlActorGet = "SELECT * from actor where id =?";
    const sqlRepoGet = "SELECT * from repo where id =?";

    db.all(sqlActorGet, actor.id, (err, rows) => {
      //if not found
      if (rows.length < 1) {
        db.run(actorSQL, actorParams, function (err, result) {
          if (err) {
            throw new Error(err.message);
          }
        });
      }
    });

    db.all(sqlRepoGet, repo.id, (err, rows) => {
      //if not found
      if (rows.length < 1) {
        db.run(repoSQL, repoParams, function (err, result) {
          if (err) {
            throw new Error(err.message);
          }
        });
      }
    });

    db.run(eventSQL, eventParams, function (err, result) {
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
