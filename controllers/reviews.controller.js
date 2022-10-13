const {
  selectReviewById,
  updateReviewById,
  selectReviews,
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
  selectReviews(req.body)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};
