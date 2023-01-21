const nodemailer=require("nodemailer");

const sendEmail=async (email,message)=> {
    const transporter=await nodemailer.createTransport({
        service:"gmail",
        host:"smtp.gmail.com",
        secure:true,
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

    await new Promise((resolve, reject) => {
        // send mail
        transporter.sendMail(mail, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });
}

module.exports=sendEmail