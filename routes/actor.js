const express = require("express");
const router = express.Router();
const db = require("../config/db");
const {
  getAllEvents,
  addEvent,
  getByActor,
  eraseEvents,
} = require("../controllers/events");

// Routes related to actor.
router.route("/").get((req, res) => {
  try {
    const sql = `SELECT  events.id as EvenID, type,  actor_id, repo_id, created_at, actor.id, actor.login, actor.avatar_url, repo.id, repo.name, repo.url, count(*) from events 
      INNER JOIN repo on events.repo_id = repo.id 
      INNER JOIN actor on events.actor_id = actor.id 
      GROUP BY actor_id ORDER BY count(*) DESC, created_at DESC, login DESC`;
    db.all(sql, (err, rows) => {
      const items = [];
      rows.map((item) => {
        const { actor_id, avatar_url, login } = item;
        items.push({ avatar_url, id: actor_id, login });
      });
      if (err) {
        throw new Error(err);
      }
      return res.status(200).json(items);
    });
  } catch (error) {
    res.status(404).json({ error: err.message });
  }
});
router.route("/streak").get((req, res) => {
  try {
    const sql = `SELECT  events.id as EvenID, type,  actor_id, repo_id, created_at, actor.id, actor.login, actor.avatar_url, repo.id, repo.name, repo.url, count(*) from events 
      INNER JOIN repo on events.repo_id = repo.id 
      INNER JOIN actor on events.actor_id = actor.id 
      GROUP BY actor_id ORDER BY count(*) DESC, created_at DESC, login DESC`;
    db.all(sql, (err, rows) => {
      const items = [];
      rows.map((item) => {
        const { actor_id, avatar_url, login } = item;
        items.push({ avatar_url, id: actor_id, login });
      });
      if (err) {
        throw new Error(err);
      }
      return res.status(200).json(items);
    });
  } catch (error) {
    res.status(404).json({ error: err.message });
  }
});

router.route("/").put((req, res) => {
  try {
    const { id, login, avatar_url } = req.body;
    const sql = `UPDATE actor SET (?,?,?) WHERE actor.id=?`;
    const selectSQL = `SELECT * from actor WHERE id =?`;

    db.all(selectSQL, id, (err, rows) => {
      if (err) {
        throw new Error(err);
        //res.status(404).json({ error: err.message });
        return;
      }
      if (rows.length < 1) {
        // throw new Error("item not found");

        return res.status(404).json({
          message: "item not found",
        });
      }
    });

    db.run(
      `UPDATE actor set 
         id = COALESCE(?,id), 
         login = COALESCE(?,login), 
         avatar_url = COALESCE(?,avatar_url) 
         WHERE id = ?`,
      [id, login, avatar_url, id],
      function (err, result) {
        if (err) {
          res.status(400).json({ error: res.message });
          return;
        }
        res.status(200).json({});
      }
    );
  } catch (error) {}
});

module.exports = router;
