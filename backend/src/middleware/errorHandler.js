const errorHandler = (err,req,res,next)=>{
  const statusCode = err.statusCode || 500;
  const response = {
    success:false,
    message: err.message || "something went wrong",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  }

  res.status(statusCode).json(response);
}


export default errorHandler