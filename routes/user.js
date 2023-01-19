const { signup, login, myProfile }= require("../controllers/user");

const router=require("express").Router();

router.post("/signup",signup);
router.post('/login',login);
router.post("/me",myProfile);

module.exports=router;