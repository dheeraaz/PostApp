export const multerUploadErrorHandler = async(err, req, res, next) => {
    if (err) {
        if(err.code==="LIMIT_FILE_SIZE"){
            res.status(400).json({
                statusCode: 400,
                data:{},
                message: "File size cannot be more than 2MB",
                success: false
            })
        }else{
            res.status(500).json({
                statusCode: 500,
                data:{},
                message: err.message || "Error in uploading image",
                success: false
            })
        }
    } else {
      next()
    }
  }
