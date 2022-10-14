const db = require("../db/connection");

exports.removeCommentById = (id) => {
  return db
    .query(`SELECT * FROM COMMENTS WHERE comment_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Comment_id does not exist",
        });
      } else {
        return db.query(`DELETE FROM comments WHERE comment_id = $1`, [id]);
      }
    })
    .then(() => {
      console.log("ererer");
      return Promise.resolve();
    });
};
