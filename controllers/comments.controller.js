const { removeCommentById } = require("../models/comments.model");

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params.comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
