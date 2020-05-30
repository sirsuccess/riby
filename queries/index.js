//create tables
exports.toCreateEVent = `CREATE TABLE events (
    id integer UNIQUE,
    type text,  
    repo_id integer,
    actor_id integer,
    created_at text,
    FOREIGN KEY (repo_id) REFERENCES repo (id) ON DELETE CASCADE ON UPDATE NO ACTION,
    FOREIGN KEY (actor_id) REFERENCES actor (id) ON DELETE CASCADE ON UPDATE NO ACTION
    )`;

exports.toCreateRepo = `CREATE TABLE repo (
    id integer UNIQUE,
    name text, 
    url text
    )`;

exports.toCreateActor = `CREATE TABLE actor (
        id integer UNIQUE,
        login text, 
        avatar_url text
        )`;

//actor route queries
exports.getActors = `SELECT  events.id as EvenID, type,  actor_id, repo_id, created_at, actor.id, actor.login, actor.avatar_url, repo.id, repo.name, repo.url, count(*) from events 
INNER JOIN repo on events.repo_id = repo.id 
INNER JOIN actor on events.actor_id = actor.id 
GROUP BY actor_id ORDER BY count(*) DESC, created_at DESC, login DESC`;

exports.getActorStreak = `SELECT  events.id as EvenID, type,  actor_id, repo_id, created_at, actor.id, actor.login, actor.avatar_url, repo.id, repo.name, repo.url, count(*) from events 
INNER JOIN repo on events.repo_id = repo.id 
INNER JOIN actor on events.actor_id = actor.id 
GROUP BY actor_id ORDER BY count(*) DESC, created_at DESC, login DESC`;

exports.selectAllActor = `SELECT * from actor WHERE id =?`;

exports.updateActor = `UPDATE actor set 
id = COALESCE(?,id), 
login = COALESCE(?,login), 
avatar_url = COALESCE(?,avatar_url) 
WHERE id = ?`;

//erase event route queries
exports.deleteEvents = "DELETE from events";
exports.deleteRepos = "DELETE from repo";
exports.deleteActors = "DELETE from actor";

//event route queries

exports.getAllEvents =
  "SELECT events.id as eventID, events.type, events.repo_id, events.actor_id, events.created_at, repo.id as repoID, repo.name, repo.url, " +
  "actor.id as actorID, actor.login, actor.avatar_url " +
  "FROM events " +
  "INNER JOIN repo on events.repo_id = repo.id " +
  "INNER JOIN actor on events.actor_id = actor.id " +
  "ORDER BY events.id ASC";

exports.getAllActorEvents =
  "SELECT events.id as eventID, events.type, events.repo_id, events.actor_id, events.created_at, repo.id as repoID, repo.name, repo.url, " +
  "actor.id as actorID, actor.login, actor.avatar_url " +
  "FROM events " +
  "INNER JOIN repo on events.repo_id = repo.id " +
  "INNER JOIN actor on events.actor_id = actor.id " +
  "WHERE actor_id=?" +
  "ORDER BY events.id ASC";

exports.postEvent =
  "INSERT INTO events (id, type, repo_id, actor_id, created_at) VALUES (?,?,?,?,?)";
exports.postActor = "INSERT INTO actor (id, login, avatar_url) VALUES (?,?,?)";
exports.postRepo = "INSERT INTO repo (id, name, url) VALUES (?,?,?)";
exports.eventSelectAllActor = "SELECT * from actor where id =?";
exports.eventSelectAllRepo = "SELECT * from repo where id =?";
