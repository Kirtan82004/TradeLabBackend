
const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      console.error("Caught Error in asyncHandler:", error);

      // Pass error to global error handler
      next(error);
    }
  };
};

export { asyncHandler };
