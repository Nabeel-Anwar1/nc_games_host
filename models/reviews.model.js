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

exports.selectReviews = (query, sort_by = "created_at", order = "desc") => {
  const validSortBy = [
    "review_id",
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];
  let queryString = `SELECT reviews.*, COUNT (comment_id) AS comment_count from reviews left join comments on reviews.review_id = comments.review_id`;

  if (!validSortBy.includes(sort_by) && sort_by !== undefined) {
    return Promise.reject({
      status: 404,
      message: "Sort_by value does not exist",
    });
  }
  if (!validOrder.includes(order) && order !== undefined) {
    return Promise.reject({
      status: 404,
      message: "Order does not exist - use asc or desc",
    });
  }

  if (query.category !== undefined) {
    queryString += ` WHERE category = $1`;
  }

  queryString += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order}`;

  if (query.category !== undefined) {
    return db.query(queryString, [query.category]).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Category does not exist",
        });
      }
      return rows;
    });
  } else {
    return db.query(queryString).then(({ rows }) => {
      return rows;
    });
  }
};

exports.selectCommentsById = (id) => {
  return db
    .query(
      `select * from comments WHERE review_id = $1 ORDER BY created_at ASC`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentById = (id, comment) => {
  const { username, body } = comment;
  if (username === undefined) {
    return Promise.reject({ status: 400, message: "Username required" });
  }
  if (body === undefined) {
    return Promise.reject({ status: 400, message: "Body required" });
  }
  return db
    .query(
      `INSERT INTO comments (body, review_id, author) values ($1, $2, $3) RETURNING *`,
      [body, id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
