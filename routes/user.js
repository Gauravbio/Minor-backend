const { signup, login, myProfile, forgotPassword, resetPassword, emotionDetection, recentlyPlayed, favourites }= require("../controllers/user");

const router=require("express").Router();

router.post("/signup",signup);
router.post('/login',login);
router.post("/me",myProfile);
router.post("/forgot",forgotPassword);
router.post('/reset',resetPassword);
router.post('/recent',recentlyPlayed);
router.post('/favourite',favourites);

module.exports=router;