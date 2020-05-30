const {
  getActors,
  getActorStreak,
  updateActor,
  selectAllActor,
} = require("../queries/index");
const db = require("../config/db");

const getAllActors = (req, res) => {
  try {
    db.all(getActors, (err, rows) => {
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
};

const updateActorCtr = (req, res) => {
  try {
    const { id, login, avatar_url } = req.body;

    db.all(selectAllActor, id, (err, rows) => {
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

    db.run(updateActor, [id, login, avatar_url, id], function (err, result) {
      if (err) {
        res.status(400).json({ error: res.message });
        return;
      }
      res.status(200).json({});
    });
  } catch (error) {}
};

const getStreak = (req, res) => {
  try {
    db.all(getActorStreak, (err, rows) => {
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
};

module.exports = {
  updateActorCtr: updateActorCtr,
  getAllActors: getAllActors,
  getStreak: getStreak,
};
