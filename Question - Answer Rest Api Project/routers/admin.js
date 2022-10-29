const express = require('express');
const {getAccessToRoute, getAdminAccess} = require('../middleware/authorization/auth');
const router = express.Router();
const {checkUserExist} = require('../middleware/database/databaseErrorHelpers'); 
const {blockUser, deleteUser} = require("../controllers/admin");
//block user
//delete user
router.use([getAccessToRoute, getAdminAccess]); 
router.get("/block/:id",checkUserExist, blockUser); 
router.delete ("/user/:id", checkUserExist, deleteUser);
module.exports = router;