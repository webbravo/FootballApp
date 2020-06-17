const nodemailer = require("nodemailer");
require("dotenv").config({
    path: ".env",
});


exports.email = (email, type) => {
    switch (type) {
        case "signup":
            composeSignUpMail(email);
            break;
        case "reset":
            composeResetPasswordMail(email)
            break;
        default:
            composeTestMail(email)
    }

    // console.log(email, type);
};

function composeSignUpMail(email) {

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASS,
        },
    });

    var mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: "TEST MAIL: 10DPredict: Thanks for Signing Up",
        text: "Welcome to 10D Predict website, where Punter make Profit daily, Remember this is a test mail",
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error.message);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

function composeResetPasswordMail(email) {
    console.log(email);
}

function composeTestMail(email) {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.ADMIN_EMAIL_PASS,
        },
    });

    var mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: email,
        subject: "10DPredict: Testing The User Email",
        text: "Welcome to 10D Predict website, This is a Test mail",
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}