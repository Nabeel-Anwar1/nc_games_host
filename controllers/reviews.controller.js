const {
  selectReviewById,
  updateReviewById,
  selectReviews,
  selectCommentsById,
  insertCommentById,
} = require("../models/reviews.model");

exports.getReviewById = (req, res, next) => {
  selectReviewById(req.params.review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  updateReviewById(req.params.review_id, req.body.inc_votes)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const {
    query: { category, sort_by, order },
  } = req;
  selectReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};

exports.getCommentsById = (req, res, next) => {
  selectReviewById(req.params.review_id)
    .then(() => {
      return selectCommentsById(req.params.review_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentById = (req, res, next) => {
  selectReviewById(req.params.review_id)
    .then(() => {
      return insertCommentById(req.params.review_id, req.body);
    })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
