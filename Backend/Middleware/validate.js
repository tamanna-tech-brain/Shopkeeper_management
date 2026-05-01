export const validateAll = (schema, source = "body") => (req, res,next) => {
    const { error } = schema.validate(req[source]);

    if(error) {
    return res.json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};