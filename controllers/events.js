const db = require("../config/db");

var getAllEvents = () => {
  const sql = "select * from events";
  const params = [];
  db.all(sql, params, (err, rows) => {
    if (err) {
      return { error: err.message };
    }
    return {
      message: "success",
      data: rows,
    };
  });
};

var addEvent = () => {};

var getByActor = () => {};

var eraseEvents = () => {};

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  getByActor: getByActor,
  eraseEvents: eraseEvents,
};
