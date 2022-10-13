exports.handlePSQLErrors = (err, req, res, next) => {
  const psqlErrorCodes = ["22P02", "23503", "23505"];
  if (psqlErrorCodes.includes(err.code)) {
    res.status(400).send({ message: "Invalid datatype found" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
};

exports.handleInternalErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error" });
};
