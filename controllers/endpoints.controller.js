const { selectEndpoints } = require("../models/endpoints.model");

exports.getEndpoints = (req, res, next) => {
  selectEndpoints().then((endpoints) => {
    endpoints = JSON.parse(endpoints);
    res.status(200).send({ endpoints });
  });
};
