const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
} = require("./controllers/errors.controller");
const {
  getReviewById,
  patchReviewById,
  getReviews,
  getCommentsById,
  postCommentById,
} = require("./controllers/reviews.controller");
const { deleteCommentById } = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsById);

app.post("/api/reviews/:review_id/comments", postCommentById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api", getEndpoints);

app.all("/api/*", (req, res) => {
  res.status(404).send({ message: "Path does not exist" });
});

app.use(handleCustomErrors);

app.use(handlePSQLErrors);

app.use(handleInternalErrors);

module.exports = app;
