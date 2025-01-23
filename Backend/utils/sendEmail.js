const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

transporter.verify((error) => {
    if (error) {
        console.log(error);
    }
});

module.exports.sendEmail = async (mail) => {
    const { to, subject, text } = mail;
    let mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    };
    transporter.sendMail(mailOptions, async (error) => {
        if (error) {
            console.log(error);
        }
    }
    );
}