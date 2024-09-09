const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      res.status(error?.code || error?.statusCode || 500).json({
        statusCode: error?.code || error?.statusCode || 500,
        message: error?.message || "An Unexpected Error Has Occured",
        success: false,
      });
    }
  };
};

export default asyncHandler;
