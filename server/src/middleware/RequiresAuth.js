exports.RequiresAuth = async (req, res, next) => {
  if (!res.locals.userId) {
    return res.status(400).send({ error: "No token found" });
  }

  return next();
};
