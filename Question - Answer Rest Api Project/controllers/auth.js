const User = require('../models/User'); 
const CustomError = require('../helpers/error/CustomError'); 
const asyncErrorWrapper = require("express-async-handler");  
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers");
const {
    validateUserInput,
    comparePassword
    }  =  require("../helpers/input/inputHelpers");
const sendEmail = require("../helpers/libraries/sendEmail");


const register = asyncErrorWrapper(async (req, res, next) => {  


   
    console.log(req.body); 

    const {name, email, password, role}= req.body; 

        const user= await User.create({ 
            name,
            email,
            password,
            role
         });
         sendJwtToClient(user, res); 
       
});

const login =  asyncErrorWrapper(async (req, res, next) => {      
     const {email, password} = req.body;  
     if(!validateUserInput(email,password)){  
         return next(new CustomError("Please check Your Inputs", 400));
     }                                       
     const user = await User.findOne({email}).select("+password");                                                                          
     if(!comparePassword(password, user.password)){ 
         return next(new CustomError("Please Check Your Credentials",400));
     }
     sendJwtToClient(user, res); 
});


const logout  = asyncErrorWrapper(async (req, res, next) => {  
    const {NODE_ENV} = process.env  

    return res.status(200)
    .cookie({
        httpOnly: true,
        expires : new Date(Date.now()),
        secure :  NODE_ENV === 'development' ? false : true  
    })
    .json({ 
        success : true,
        message : "Logout Successfull"
    });
});



const getUser =(req, res, next)   => { 
    res.json({
        success: true,
        data : {
            id : req.user.id,
            name : req.user.name
        }
    });
};

const imageUpload = asyncErrorWrapper(async (req, res, next) => {
    
   
   const user= await User.findByIdAndUpdate(req.user.id,{
        "profile_image": req.savedProfileImage 
    },{
        new: true, // new users
        runValidators: true // nValidators work
    }); 

    res.status(200)
    .json({
        success: true,
        message: 'image upload successful!',
        data: user
    });
});


    //forgot Password
    const forgotPassword =  asyncErrorWrapper(async (req, res, next) => {

    const resetEmail = req.body.email; 

    
    const user = await User.findOne({email: resetEmail }); 

    if(!user){ 
        return next(new CustomError("Please your control your email address or membership.",400));
    }
    const resetPasswordToken = user.getResetPasswordTokenFromUser(); 

    await user.save(); 

    
    const resetPasswordUrl  = `https://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`

    //html 
    const emailTemplate = `
        <h3> Reset Your Password </h3>
        <p> This <a href='${resetPasswordUrl}' target= '_blank'>link</a> will expire in 1 hour </p>
    `;

    try{
        await sendMail({ 
            
            
            from : process.env.SMTP_USER,
            to : resetEmail,
            subject: "Reset Your Password",
            html : emailTemplate 
    });
    return res.status(200).json({   // response returned
        success: true,
        message: "Token Sent To Your Email"
    });
    }
    catch(err){ 
        
        user.resetPasswordToken = undefined; 
        user.resetPasswordExpire = undefined;
        await user.save(); // 2. save

        // throw error
        return next(new CustomError("Email Could Not Be Send",500));
    } 
});

const resetPassword =   asyncErrorWrapper(async (req, res, next) => {

    const {resetPasswordToken} = req.query; // resetPasswordToken
    const {password} = req.body; 

    if(!resetPasswordToken){
        return new(new CustomError("Please provide a valid token",400))
    }
    let user = await User.findOne({ // choose user
        resetPasswordToken : resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now() } // dont expire token 
    });

    if(!user){ 
        return next(new CustomError("Invalid token or Session expired", 404));
    }
    // update password process:
    user.password = password; 
    user.resetPasswordToken = undefined; 
    user.resetPasswordExpire = undefined;
    await user.save(); 


    return res.status(200)
    .json({
        success: true,
        message: "Reset Password Process Successfull"
    });
});

const editDetails = asyncErrorWrapper(async (req, res, next) => {

    const editInformations = req.body; // get information
    const user = await User.findByIdAndUpdate(req.user.id,editInformation,{   
        runValidators : true
    });
    return res.status (200)
    .json({
        success : true,
        data : user 
    });
});


module.exports = { 
    register, 
    login,
    getUser,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
};
