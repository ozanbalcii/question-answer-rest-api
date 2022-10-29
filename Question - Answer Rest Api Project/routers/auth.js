const express = require('express'); 
const router = express.Router(); 
const {
    register,
    login,
    logout,
    getUser,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
} =  require('../controllers/auth');

const {getAccessToRoute} = require("../middleware/authorization/auth");
const profileImageUpload= require("../middleware/libraries/profileImageUpload");

 //  router.get("/register",(req, res) => { 
//     res.send("auth register page");
//  })
//  router.get("/",(req, res) => { 
//     res.send("auth home page");
//  })

router.post("/register", register );
router.get("/profile", getAccessToRoute, getUser); 
router.get("/logout", getAccessToRoute, logout); 
router.post("/forgotpassword", forgotPassword);  
router.put ("/resetpassword", resetPassword);
router.put("/edit",getAccessToRoute, editDetails);
router.post(
    "/upload",
    [getAccessToRoute, profileImageUpload.single("profile_image")],
    imageUpload
    );          

 module.exports = router;
