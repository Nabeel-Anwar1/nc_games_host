const db = require("../db/connection");

exports.selectReviewById = (id) => {
  return db
    .query(
      "SELECT reviews.*, COUNT (comment_id) AS comment_count from reviews left join comments on reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id",
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Review ID does not exist",
        });
      } else {
        rows[0].created_at = rows[0].created_at.toString();
        return rows[0];
      }
    });
};

exports.updateReviewById = (id, inc_votes) => {
  return db
    .query(
      "UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *",
      [inc_votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Review ID does not exist",
        });
      } else {
        return rows[0];
      }
    });
};

exports.selectReviews = (query) => {
  const validCategories = [
    "euro game",
    "dexterity",
    "social deduction",
    "children's games",
  ];
  let queryString = `SELECT reviews.*, COUNT (comment_id) AS comment_count from reviews left join comments on reviews.review_id = comments.review_id`;

  if (
    !validCategories.includes(query.category) &&
    query.category !== undefined
  ) {
    return Promise.reject({ status: 404, message: "Category does not exist" });
  }
  if (
    !Object.keys(query).includes("category") &&
    Object.keys(query).length > 0
  ) {
    return Promise.reject({ status: 400, message: "Query invalid" });
  }

  if (validCategories.includes(query.category)) {
    queryString += ` WHERE category = '${query.category}'`;
  }

  queryString += ` GROUP BY reviews.review_id ORDER BY created_at DESC`;

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};