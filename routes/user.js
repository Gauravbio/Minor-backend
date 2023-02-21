const { signup, login, myProfile, forgotPassword, resetPassword, emotionDetection, recentlyPlayed }= require("../controllers/user");

const router=require("express").Router();

router.post("/signup",signup);
router.post('/login',login);
router.post("/me",myProfile);
router.post("/forgot",forgotPassword);
router.post('/reset',resetPassword);
router.post('/emotion',emotionDetection);
router.post('/recent',recentlyPlayed);

module.exports=router;