const express = require('express'); 
const {  getSingleQuestion, 
         getAllQuestions,
         askNewQuestion,
         editQuestion,
         deleteQuestion,
         likeQuestion,
         undoLikeQuestion
      } = require('../controllers/question'); 
const {checkQuestionExist} = require('../middleware/database/databaseErrorHelpers');
const router = express.Router(); 

const questionQueryMiddleware =  require('../middleware/query/questionQueryMiddleware');
const answerQueryMiddleware =  require('../middleware/query/answerQueryMiddleware');
 
const {getAccessToRoute, getQuestionOwnerAccess} = require('../middleware/authorization/auth');
const answer = require('./answer');
const Question = require('../models/Question');


router.get("/:id/like",
      [getAccessToRoute,
      checkQuestionExist],
      likeQuestion); 
      
router.get("/:id/undo_like",
      [getAccessToRoute,
      checkQuestionExist],
      likeQuestion); 

router.get("/", 
questionQueryMiddleware(Question,{ 
      population: {
            path : "user",
            select : "name profile_image"
      }
}), getAllQuestions);


router.get("/:id",checkQuestionExist,
answerQueryMiddleware(Question, {
      population: [

      {
            path : "user",
            select : "name profile_image"
      },
      {
            path : "answers",
            select : "content"
      }
 ]
}),
getSingleQuestion); 


router.post("/ask", getAccessToRoute, askNewQuestion);

router.put ("/:id/edit",
      [getAccessToRoute,
      checkQuestionExist,
      getQuestionOwnerAccess],
      editQuestion); 

router.delete ("/:id/delete",
      [getAccessToRoute,
      checkQuestionExist,
      getQuestionOwnerAccess],
      deleteQuestion); 
      
router.use("/:question_id/answers",
           checkQuestionExist, answer) 
           
 module.exports = router; 