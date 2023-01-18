require('dotenv').config({path:"./config/config.env"});
const app=require('./app');

//database
const {connectDatabase}=require("./config/db");
connectDatabase();

app.listen(process.env.PORT,()=> {
    console.log(`server is running at http://localhost:${process.env.PORT}`);
})