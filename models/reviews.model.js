const db = require("../db/connection");

exports.selectReviewById = (id) => {
  if (id === undefined) {
    Promise.reject({ status: 400, message: "Invalid ID" });
  } else {
    return db
      .query("SELECT * FROM reviews WHERE review_id = $1", [id])
      .then(({ rows }) => {
        rows[0].created_at = rows[0].created_at.toString();
        return rows[0];
      });
  }
};
