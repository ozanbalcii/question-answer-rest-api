const CustomError = require('../../helpers/error/CustomError');
const asyncErrorWrapper = require("express-async-handler");  
const User = require('../../models/User');
const Question = require("../../models/Question");
const Answer =  require('../../models/Answer');


const jwt = require('jsonwebtoken');
const {isTokenIncluded,
      comparePassword,
      getAccessTokenFromHeader} = require("../../helpers/authorization/tokenHelpers");
// const { request } = require('express');

const getAccessToRoute =(req, res, next) => { 
    const{JWT_SECRET_KEY} = process.env;
    if(!isTokenIncluded(req)){ 
        // status: 401 Unauthorized 
        // status: 403 Forbidden   
        return next(new CustomError("You are not authorization to access this route",401))
    } 
    const accessToken = getAccessTokenFromHeader(req); 
    jwt.verify(accessToken, JWT_SECRET_KEY, (err,decoded)=>{ 
        if(err){ 
            return next(
                new CustomError("You are not authorization yo access this route",401)
                );
        }
        req.user = {
            id : decoded.id,
            name : decoded.name
        }
        next();
    });
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
    const {id} = req.user;
    const user = await User.findById(id);
    if(user.role !== "admin") {
        return next( new CustomError("Only admins can access this route",403));
    }
    next(); 
});

const getQuestionOwnerAccess= asyncErrorWrapper(async (req, res, next) => {
    
    const userId = req.user.id; 
    const answerId = req.params.id; 

    const question =  await Answer.findById(questionId);

    if( question.user != userId){ 
        return next(new CustomError("Only owner can handle this  operation",403));
    };
   next(); 
    });


const getAnswerOwnerAccess= asyncErrorWrapper(async (req, res, next) => {
    
    const userId = req.user.id; 
    const answerId = req.params.answer_id; 
    const answer =  await Answer.findById(answerId);

    if(answer.user != userId){ 
        return next(new CustomError("Only owner can handle this  operation",403));
    };
   next(); 

});

module.exports = {
    getAccessToRoute,
    getAdminAccess, 
    getQuestionOwnerAccess,
    getAnswerOwnerAccess  
};