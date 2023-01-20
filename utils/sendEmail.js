const nodemailer=require("nodemailer");

const sendEmail=(email,message)=> {
    const transporter=nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        secure:false,
        auth:{
            user:process.env.MAIL_ID,
            pass: process.env.GMAIL_PASSWORD
        }
    });

    const mail={
        from: process.env.MAIL_ID,
        to:email,
        subject:"Reset Paswword",
        text: message
    }

    transporter.sendMail(mail,(err,info)=>{
        if(err) console.log(err)
        if(info) console.log(info);
    })
}

module.exports=sendEmail