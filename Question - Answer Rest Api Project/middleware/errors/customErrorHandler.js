
const CustomError=require('../../helpers/error/CustomError');

const customErrorHandler = ((err,req,res,next)=>{
    // console.log(err);   
    let customError = err; 
    console.log(customError.name, customError.message, customError.status); 
    
    if(err.name==="SyntaxError"){ 
        customError=new CustomError("Unexpected Syntax",400) 
        console.log(customError.message,customError.status);
    }
    if(err.name==="ValidationError"){
        customError = new CustomError(err.message, 400); 
    }
    if(err.name ==="CastError"){
        customError.castError = new CastError("Please provide a valid id",400);
    }
    if(err.code===1100){
        customError = new CustomError("Duplicate Key Found: Chech Your Input", 400); // kullanıcı hatası old için status:400 verildi. 
    }
    res     
    .status(customError.status || 500)     
    .json({
        success: false ,     
        message: customError.message || "internal server error"  
    });
});

module.exports = customErrorHandler;

